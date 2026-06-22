import { Router } from 'express';
import { createAnnouncement, createModerationCase, getAdminOverview, getPermissions, listAnnouncements, listAuditLogs, listModerationCases, listSystemConfig, listUsers, updateModerationCase, updateUserAdmin, upsertSystemConfig } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/overview', getAdminOverview);
router.get('/users', listUsers);
router.patch('/users/:id', updateUserAdmin);
router.get('/announcements', listAnnouncements);
router.post('/announcements', createAnnouncement);
router.get('/audit-logs', listAuditLogs);
router.get('/moderation', listModerationCases);
router.post('/moderation', createModerationCase);
router.patch('/moderation/:id', updateModerationCase);
router.get('/config', listSystemConfig);
router.put('/config', upsertSystemConfig);
router.get('/permissions', getPermissions);

export default router;