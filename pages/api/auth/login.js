// pages/api/auth/login.js
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

function generateToken(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user && user.password === password) {
      if (user.status === 'blocked') return res.status(403).json({ message: 'Your account has been blocked.' });
      user.lastSeen = new Date();
      await user.save();
      res.json({ _id: user._id, phoneNumber: user.phoneNumber, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
}
