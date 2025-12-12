// pages/api/admin/search.js  -> /api/admin/search?title=abc
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import { protect, admin } from '../../../middleware/auth';

export default protect(admin(async function handler(req,res){
  await dbConnect();
  const { title } = req.query;
  if (!title) return res.status(400).json({ message: 'Please provide a title to search for.' });
  const songs = await Song.find({ title: { $regex: title, $options: 'i' } });
  res.json(songs);
}));
