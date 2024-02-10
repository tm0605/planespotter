import pool from '../models/planeSpotterDB.js';

const getAirport = async (req, res) => {
    try {
        const icao = req.query.icao_code;

        const result = await pool.query('SELECT * FROM airports WHERE icao_code = $1', [icao]);
        console.log(result);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export default getAirport;