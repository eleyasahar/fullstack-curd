import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Authorization header se Bearer Access Token extract karein
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Token missing',
      });
    }

    // Access Token verify karein
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Database se user verify karein (password remove karke)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User not found',
      });
    }

    // Logged-in user ki details req object par attach karein
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};