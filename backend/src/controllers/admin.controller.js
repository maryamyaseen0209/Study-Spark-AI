import Announcement from '../models/Announcement.js';
import AuditLog from '../models/AuditLog.js';
import Classroom from '../models/Classroom.js';
import Meeting from '../models/Meeting.js';
import ModerationCase from '../models/ModerationCase.js';
import QuizAttempt from '../models/QuizAttempt.js';
import SystemConfig from '../models/SystemConfig.js';
import User from '../models/User.js';
import { writeAuditLog } from '../services/audit.service.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminOverview = asyncHandler(async (req, res) => {
  const [users, classrooms, meetings, attempts, moderationOpen] = await Promise.all([
    User.countDocuments(), Classroom.countDocuments(), Meeting.countDocuments(), QuizAttempt.countDocuments(), ModerationCase.countDocuments({ status: { $in: ['open', 'reviewing'] } }),
  ]);
  res.json({ success: true, overview: { users, classrooms, meetings, attempts, moderationOpen } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -sessions').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, users });
});

export const updateUserAdmin = asyncHandler(async (req, res) => {
  const allowed = ['role', 'status'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -sessions');
  if (!user) throw new ApiError(404, 'User not found.');
  await writeAuditLog({ req, action: 'admin.user.updated', entityType: 'User', entityId: user._id, summary: `Updated ${user.email}`, metadata: updates });
  res.json({ success: true, user });
});

export const listAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().populate('createdBy', 'fullName email').sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, announcements });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, body, audience = 'all', status = 'published' } = req.body;
  if (!title || !body) throw new ApiError(400, 'Title and body are required.');
  const announcement = await Announcement.create({ title, body, audience, status, createdBy: req.user._id, publishedAt: status === 'published' ? new Date() : null });
  await writeAuditLog({ req, action: 'admin.announcement.created', entityType: 'Announcement', entityId: announcement._id, summary: `Created announcement ${title}` });
  res.status(201).json({ success: true, announcement });
});

export const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().populate('actor', 'fullName email role').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, logs });
});

export const listModerationCases = asyncHandler(async (req, res) => {
  const cases = await ModerationCase.find().populate('reporter targetUser assignedTo', 'fullName email role').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, cases });
});

export const createModerationCase = asyncHandler(async (req, res) => {
  const { targetUser, reason, details = '' } = req.body;
  if (!reason) throw new ApiError(400, 'Reason is required.');
  const item = await ModerationCase.create({ reporter: req.user._id, targetUser, reason, details });
  await writeAuditLog({ req, action: 'moderation.created', entityType: 'ModerationCase', entityId: item._id, summary: `Opened moderation case: ${reason}` });
  res.status(201).json({ success: true, case: item });
});

export const updateModerationCase = asyncHandler(async (req, res) => {
  const item = await ModerationCase.findByIdAndUpdate(req.params.id, { ...req.body, assignedTo: req.body.assignedTo || req.user._id }, { new: true });
  if (!item) throw new ApiError(404, 'Moderation case not found.');
  await writeAuditLog({ req, action: 'moderation.updated', entityType: 'ModerationCase', entityId: item._id, summary: `Updated moderation case ${item._id}` });
  res.json({ success: true, case: item });
});

export const listSystemConfig = asyncHandler(async (req, res) => {
  const config = await SystemConfig.find().populate('updatedBy', 'fullName email').sort({ key: 1 });
  res.json({ success: true, config });
});

export const upsertSystemConfig = asyncHandler(async (req, res) => {
  const { key, value, description = '' } = req.body;
  if (!key) throw new ApiError(400, 'Config key is required.');
  const config = await SystemConfig.findOneAndUpdate({ key }, { value, description, updatedBy: req.user._id }, { new: true, upsert: true });
  await writeAuditLog({ req, action: 'admin.config.updated', entityType: 'SystemConfig', entityId: config._id, summary: `Updated config ${key}` });
  res.json({ success: true, config });
});

export const getPermissions = asyncHandler(async (req, res) => {
  res.json({ success: true, permissions: {
    student: ['dashboard:read', 'classroom:join', 'quiz:attempt', 'message:send'],
    teacher: ['classroom:manage', 'quiz:publish', 'meeting:schedule', 'analytics:read'],
    admin: ['users:manage', 'moderation:manage', 'audit:read', 'settings:manage', 'analytics:read'],
  } });
});