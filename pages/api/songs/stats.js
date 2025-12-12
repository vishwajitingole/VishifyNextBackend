// pages/api/songs/stats.js
import { applyCors } from '../../../lib/cors';
import dbConnect from '../../../lib/db';
import { protect } from '../../../middleware/auth';
import Song from '../../../models/Song';

export default protect(async function handler(req, res) {
    if (applyCors(req, res)) return;
    await dbConnect();
    const count = await Song.countDocuments();
    res.json({ count });
});