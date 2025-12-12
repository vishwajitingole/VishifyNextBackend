// middleware/auth.js
import jwt from 'jsonwebtoken';
import dbConnect from '../lib/db';
import User from '../models/User';

export const protect = handler => async (req, res) => {
  await dbConnect();
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized, no token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
    if (user.status === 'blocked') return res.status(403).json({ message: 'Your account has been blocked.' });

    // Update lastSeen asynchronously (non-blocking)
    User.findByIdAndUpdate(user._id, { lastSeen: new Date() }).exec();

    req.user = user;
    return handler(req, res);
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = handler => async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized as an admin' });
  return handler(req, res);
};
