// pages/api/admin/upload.js
import nextConnect from 'next-connect';
import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';
import cloudinary from '../../../utils/cloudinary';
import multer from 'multer';
import { protect, admin } from '../../../middleware/auth';

const upload = multer({ storage: multer.diskStorage({}) });

const handler = nextConnect();
handler.use(upload.fields([{ name: 'songFile', maxCount: 1 }, { name: 'albumArtFile', maxCount: 1 }]));

handler.post(async (req,res) => {
  await dbConnect();
  const { title, artist, movie, moods } = req.body;
  const songFile = req.files.songFile ? req.files.songFile[0] : null;
  const albumArtFile = req.files.albumArtFile ? req.files.albumArtFile[0] : null;
  if (!songFile || !title || !moods) return res.status(400).json({ message: 'Song file, title, and moods are required.' });

  try{
    const songUploadResult = await cloudinary.uploader.upload(songFile.path, { resource_type: 'raw', folder: 'music_app_songs' });
    let albumArtData = { url: '', public_id: '' };
    if (albumArtFile) {
      const artUploadResult = await cloudinary.uploader.upload(albumArtFile.path, { folder: 'music_app_art' });
      albumArtData.url = artUploadResult.secure_url;
      albumArtData.public_id = artUploadResult.public_id;
    }
    const song = await Song.create({ title, artist, movie, moods: moods.split(',').map(m=>m.trim()), url: songUploadResult.secure_url, public_id: songUploadResult.public_id, albumArtUrl: albumArtData.url, albumArtPublicId: albumArtData.public_id });
    res.status(201).json({ message: 'Song uploaded successfully', song });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error uploading song' });
  }
});

export default protect(admin(handler));
