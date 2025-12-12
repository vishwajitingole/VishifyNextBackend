import dbConnect from '../../../lib/db';
import { protect } from '../../../middleware/auth';
import Song from '../../../models/Song';

async function main(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    await dbConnect();

    try {
        const { mood } = req.query;

        let songs = mood && mood !== 'Kuch bhi' ?
            await Song.find({ moods: mood }) :
            await Song.find({});

        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }

        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching songs' });
    }
}

export default protect(main);