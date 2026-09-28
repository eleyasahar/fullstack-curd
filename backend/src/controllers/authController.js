import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Access Token Generate Karne Ke Liye Function (Short-lived: 15 min)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

// Refresh Token Generate Karne Ke Liye Function (Long-lived: 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// 1. REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Is email se account pehle se maujood hai',
      });
    }

    // User create karein (Password model pre-save hook se hash ho jayega)
    const user = await User.create({ name, email, password });

    // Response mein password filter karke bhejien (Tokens nahi bhejte register par)
    res.status(201).json({
      success: true,
      message: 'User successful register ho gaya',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User check karein with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials', // Generic error security ke liye
      });
    }

    // Password verify karein
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Tokens generate karein
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Refresh Token DB mein save karein
    user.refreshToken = refreshToken;
    await user.save();

    // Refresh token ko httpOnly cookie mein set karein
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    // DB mein token exist karta hai ya nahi check karein
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    // Token verify karein
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Expired or invalid refresh token' });
      }

      // Naya Access Token issue karein
      const newAccessToken = generateAccessToken(user._id);

      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. LOGOUT USER
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (token) {
      // DB se refresh token null kar dein
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
    }

    // Cookie clear karein
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET ME (Logged-in User Profile)
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};