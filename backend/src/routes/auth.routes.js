import { Router } from 'express';
import { forgotPassword, login, logout, me, refresh, register, resetPassword, revokeSession, sessions, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator, updateProfileValidator } from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.patch('/profile', requireAuth, updateProfileValidator, validate, updateProfile);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);
router.get('/sessions', requireAuth, sessions);
router.delete('/sessions/:sessionId', requireAuth, revokeSession);

export default router;
