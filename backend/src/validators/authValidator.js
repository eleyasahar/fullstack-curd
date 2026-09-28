import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name zaroori hai'),
  body('email').trim().notEmpty().withMessage('Email zaroori hai').isEmail().withMessage('Sahi email format daalein').normalizeEmail(),
  body('password').notEmpty().withMessage('Password zaroori hai').isLength({ min: 6 }).withMessage('Password kam se kam 6 characters ka hona chahiye'),
  body('confirmPassword').notEmpty().withMessage('Confirm password zaroori hai').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password aur Confirm Password match nahi kar rahe');
    }
    return true;
  }),
];

export const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email zaroori hai').isEmail().withMessage('Valid email daalein'),
  body('password').notEmpty().withMessage('Password zaroori hai'),
];