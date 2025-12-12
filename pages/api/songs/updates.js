// pages/api/songs/updates.js
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';

// Returns songs added after `since` query param (ISO timestamp)
// Example: /api/songs/updates?since=2025-12-01T00:00:00.000Z

export default async function handler(req,res){
  if (req.method !== 'GET') return res.status(405).end();
  await dbConnect();
  const { since } = req.query;
  if (!since) return res.status(400).json({ message: 'Please provide since query param as ISO timestamp' });
  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) return res.status(400).json({ message: 'Invalid date' });

  try{
    const songs = await Song.find({ createdAt: { $gt: sinceDate } }).sort({ createdAt: 1 });
    const payload = songs.map(s => ({
      _id: s._id,
      title: s.title,
      url: s.url,
      public_id: s.public_id,
      createdAt: s.createdAt,
      moods: s.moods,
    }));
    res.json({ since: sinceDate.toISOString(), newCount: payload.length, songs: payload });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error fetching updates' });
  }
}
