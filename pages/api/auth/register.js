// pages/api/auth/register.js
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

function generateToken(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { phoneNumber, email, password } = req.body;
  try{
    const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExists) return res.status(400).json({ message: 'User with this email or phone number already exists' });
    const user = await User.create({ phoneNumber, email, password });
    res.status(201).json({ _id: user._id, phoneNumber: user.phoneNumber, email: user.email, role: user.role, token: generateToken(user._id) });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
}
