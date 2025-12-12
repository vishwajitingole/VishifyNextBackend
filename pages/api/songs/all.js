import { applyCors } from '../../../lib/cors';
import dbConnect from '../../../lib/db';
import { protect } from '../../../middleware/auth';
import Song from '../../../models/Song';

async function main(req, res) {
    if (applyCors(req, res)) return;
    if (req.method !== 'GET') return res.status(405).end();

    await dbConnect();
    try {
        const songs = await Song.find({}).sort({ title: 'asc' });
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sorted song list' });
    }
}

export default protect(main);