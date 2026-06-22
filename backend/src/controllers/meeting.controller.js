import Classroom from '../models/Classroom.js';
import Meeting from '../models/Meeting.js';
import Notification from '../models/Notification.js';
import { createZoomMeeting } from '../services/zoom.service.js';
import { writeAuditLog } from '../services/audit.service.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function getAccessibleClassrooms(user) {
  if (user.role === 'teacher') return Classroom.find({ teacher: user._id, status: 'active' }).select('_id name subject students teacher');
  if (user.role === 'student') return Classroom.find({ students: user._id, status: 'active' }).select('_id name subject students teacher');
  return Classroom.find({ status: 'active' }).select('_id name subject students teacher');
}

export const listMeetings = asyncHandler(async (req, res) => {
  const classrooms = await getAccessibleClassrooms(req.user);
  const classroomIds = classrooms.map((item) => item._id);
  const meetings = await Meeting.find({ classroom: { $in: classroomIds } })
    .populate('classroom', 'name subject')
    .populate('host', 'fullName email role')
    .sort({ startsAt: 1 })
    .limit(100);
  res.json({ success: true, meetings, classrooms });
});

export const createMeeting = asyncHandler(async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) throw new ApiError(403, 'Only teachers and admins can schedule meetings.');
  const { title, description = '', classroomId, startsAt, durationMinutes = 45, provider = 'zoom' } = req.body;
  if (!title || !classroomId || !startsAt) throw new ApiError(400, 'Title, classroom, and start time are required.');
  const classroomQuery = req.user.role === 'admin' ? { _id: classroomId } : { _id: classroomId, teacher: req.user._id };
  const classroom = await Classroom.findOne(classroomQuery);
  if (!classroom) throw new ApiError(404, 'Classroom not found or not owned by you.');
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) throw new ApiError(400, 'Invalid meeting start time.');
  const zoom = provider === 'zoom' ? await createZoomMeeting({ title, startsAt: startDate, durationMinutes }) : { providerStatus: 'manual' };
  const meeting = await Meeting.create({
    title,
    description,
    classroom: classroom._id,
    host: req.user._id,
    startsAt: startDate,
    durationMinutes,
    provider,
    attendees: classroom.students,
    joinUrl: zoom.joinUrl,
    startUrl: zoom.startUrl,
    providerMeetingId: zoom.providerMeetingId,
    providerStatus: zoom.providerStatus,
  });
  await Notification.insertMany(classroom.students.map((recipient) => ({
    recipient,
    actor: req.user._id,
    classroom: classroom._id,
    type: 'meeting_scheduled',
    title: `Meeting scheduled: ${title}`,
    message: `${classroom.name} meeting starts ${startDate.toLocaleString()}.`,
  })));
  await writeAuditLog({ req, action: 'meeting.created', entityType: 'Meeting', entityId: meeting._id, summary: `Scheduled meeting ${title}` });
  res.status(201).json({ success: true, meeting, configurationMessage: zoom.message });
});

export const cancelMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id).populate('classroom', 'teacher students name');
  if (!meeting) throw new ApiError(404, 'Meeting not found.');
  const canCancel = req.user.role === 'admin' || String(meeting.host) === String(req.user._id) || String(meeting.classroom.teacher) === String(req.user._id);
  if (!canCancel) throw new ApiError(403, 'You cannot cancel this meeting.');
  meeting.status = 'cancelled';
  await meeting.save();
  await writeAuditLog({ req, action: 'meeting.cancelled', entityType: 'Meeting', entityId: meeting._id, summary: `Cancelled meeting ${meeting.title}` });
  res.json({ success: true, meeting });
});

export const sendMeetingReminders = asyncHandler(async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) throw new ApiError(403, 'Only staff can send meeting reminders.');
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const query = { status: 'scheduled', startsAt: { $gte: now, $lte: soon }, reminderSentAt: null };
  if (req.user.role === 'teacher') query.host = req.user._id;
  const meetings = await Meeting.find(query).populate('classroom', 'name').populate('attendees', '_id');
  let notifications = 0;
  for (const meeting of meetings) {
    const docs = meeting.attendees.map((attendee) => ({ recipient: attendee._id, actor: req.user._id, classroom: meeting.classroom._id, type: 'meeting_reminder', title: `Reminder: ${meeting.title}`, message: `${meeting.classroom.name} meeting starts ${meeting.startsAt.toLocaleString()}.` }));
    if (docs.length) await Notification.insertMany(docs);
    meeting.reminderSentAt = new Date();
    await meeting.save();
    notifications += docs.length;
  }
  res.json({ success: true, message: `Sent ${notifications} meeting reminder notifications.`, meetingsProcessed: meetings.length });
});