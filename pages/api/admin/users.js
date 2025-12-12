// pages/api/admin/users.js  -> GET all users
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import { protect, admin } from '../../../middleware/auth';

export default protect(admin(async function handler(req,res){
  await dbConnect();
  const users = await User.find({}).select('-password');
  res.json(users);
}));
