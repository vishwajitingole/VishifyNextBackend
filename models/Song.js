// models/Song.js
import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  movie: String,
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  albumArtUrl: { type: String, default: '' },
  albumArtPublicId: { type: String, default: '' },
  moods: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Song || mongoose.model('Song', SongSchema);
