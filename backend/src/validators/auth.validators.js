import { body } from 'express-validator';

export const registerValidator = [
  body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name must be 2-120 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['student', 'teacher']).withMessage('Public registration is limited to student or teacher accounts'),
  body('termsAccepted').equals('true').withMessage('Terms acceptance is required'),
  body('institution').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('rememberMe').optional().isBoolean(),
];

export const forgotPasswordValidator = [body('email').isEmail().normalizeEmail()];

export const resetPasswordValidator = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const updateProfileValidator = [
  body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name must be 2-120 characters'),
  body('institution').optional({ checkFalsy: true }).trim().isLength({ max: 160 }).withMessage('Institution must be 160 characters or fewer'),
  body('bio').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Bio must be 500 characters or fewer'),
  body('preferences.theme').optional().isIn(['light', 'dark', 'system']).withMessage('Theme must be light, dark, or system'),
  body('preferences.language').optional().trim().isLength({ min: 2, max: 12 }).withMessage('Language must be 2-12 characters'),
  body('preferences.emailNotifications').optional().isBoolean().withMessage('Email notifications must be true or false'),
];
