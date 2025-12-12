import dbConnect from '../../../lib/db';
import Song from '../../../models/Song';

async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    await dbConnect();

    const { since } = req.query;
    if (!since) return res.status(400).json({ message: 'Please provide since query param as ISO timestamp' });

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) return res.status(400).json({ message: 'Invalid date' });

    try {
        const songs = await Song.find({ createdAt: { $gt: sinceDate } }).sort({ createdAt: 1 });

        res.json({
            since: sinceDate.toISOString(),
            newCount: songs.length,
            songs: songs
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching updates' });
    }
}

export default handler;