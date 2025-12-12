import { applyCors } from '../../../lib/cors';
import dbConnect from '../../../lib/db';
import { protect } from '../../../middleware/auth';
import Song from '../../../models/Song';

async function main(req, res) {
    if (applyCors(req, res)) return;
    if (req.method !== 'GET') return res.status(405).end();

    await dbConnect();

    try {
        const song = await Song.findById(req.query.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        res.json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching single song' });
    }
}

export default protect(main);