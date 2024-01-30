import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // This might be needed if RDS uses SSL
    }
};

const { Pool } = pkg;
const pool = new Pool(dbConfig);

pool.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database');
    }
});

const getAirport = async (req, res) => {
    try {
        const icao = req.query.icao_code;

        const result = await pool.query(`SELECT * FROM airports WHERE icao_code='${icao}'`);
        console.log(result);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export default getAirport;