// pages/api/songs/[id].js  -> GET single song by id
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import { protect } from '../../../middleware/auth';

export default protect(async function handler(req,res){
  if (req.method !== 'GET') return res.status(405).end();
  await dbConnect();
  try{
    const song = await Song.findById(req.query.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  }catch(err){
    res.status(500).json({ message: 'Error fetching single song' });
  }
});
