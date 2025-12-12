// pages/api/songs/stats.js
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import { protect } from '../../../middleware/auth';

export default protect(async function handler(req,res){
  await dbConnect();
  const count = await Song.countDocuments();
  res.json({ count });
});
