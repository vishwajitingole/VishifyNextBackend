// pages/api/songs/shuffle.js
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import { protect } from '../../../middleware/auth';

async function handler(req,res){
  if (req.method !== 'GET') return res.status(405).end();
  await dbConnect();
  const { mood } = req.query;
  try{
    let songs;
    if (mood && mood !== 'Kuch bhi') songs = await Song.find({ moods: mood });
    else songs = await Song.find({});
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    res.json(songs);
  }catch(err){
    res.status(500).json({ message: 'Error fetching songs' });
  }
}

export default protect(handler);
