// pages/api/admin/delete.js  (DELETE /api/admin/delete?id=SONGID)
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import cloudinary from '../../../utils/cloudinary';
import { protect, admin } from '../../../middleware/auth';

export default protect(admin(async function handler(req,res){
  if (req.method !== 'DELETE') return res.status(405).end();
  await dbConnect();
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Please provide song id' });
  try{
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found.' });
    await cloudinary.uploader.destroy(song.public_id, { resource_type: 'raw' });
    if (song.albumArtPublicId) await cloudinary.uploader.destroy(song.albumArtPublicId);
    await Song.findByIdAndDelete(id);
    res.json({ message: 'Song deleted successfully.' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error deleting song.' });
  }
}));
