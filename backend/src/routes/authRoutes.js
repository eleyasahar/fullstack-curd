import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from '../controllers/authController.js'

import {
  registerValidation,
  loginValidation,
} from '../validators/authValidator.js';
import {validate} from '../middlewares/validate.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

//public routes
router.post('/register', registerValidation, validate , register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshToken);

//protected Routes (token requierd )

router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;