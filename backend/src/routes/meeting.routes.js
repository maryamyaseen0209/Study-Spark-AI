import { Router } from 'express';
import { cancelMeeting, createMeeting, listMeetings, sendMeetingReminders } from '../controllers/meeting.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);
router.get('/', listMeetings);
router.post('/', createMeeting);
router.post('/reminders/run', sendMeetingReminders);
router.patch('/:id/cancel', cancelMeeting);

export default router;