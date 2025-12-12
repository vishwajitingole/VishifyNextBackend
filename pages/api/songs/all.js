// pages/api/songs/all.js
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import { protect } from '../../../middleware/auth';

export default protect(async function handler(req,res){
  if (req.method !== 'GET') return res.status(405).end();
  await dbConnect();
  try{
    const songs = await Song.find({}).sort({ title: 'asc' });
    res.json(songs);
  }catch(err){
    res.status(500).json({ message: 'Error fetching sorted song list' });
  }
});
