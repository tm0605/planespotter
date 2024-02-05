import pool from './planeSpotterDB.js';
import getFlightsAll from '../controllers/flightApiController.js';
import { Readable } from 'stream';
import { from as copyFrom } from 'pg-copy-streams';

const streamDataToPostgres = async (req, res) => {
    const json = await getFlightsAll();
    // Assuming 'json.response' contains your flight data array
    const flights = json;
    console.log('running streamDataToPostgres')

    // Convert each flight record into a CSV string
    const csvData = flights.map(flight => {
        return [
            flight.hex,
            flight.reg_number,
            flight.flag,
            flight.lat,
            flight.lng,
            flight.alt,
            flight.dir,
            flight.speed,
            flight.v_speed,
            flight.squawk,
            flight.flight_number,
            flight.flight_icao,
            flight.flight_iata,
            flight.dep_icao,
            flight.dep_iata,
            flight.arr_icao,
            flight.arr_iata,
            flight.airline_icao,
            flight.airline_iata,
            flight.aircraft_icao,
            flight.updated,
            flight.status,
            flight.type
        ].join(',');
    }).join('\n');
    
    // 'csvData' now contains a CSV string of your flight data, ready for insertion


    const client = await pool.connect();
    try {
        console.log('trying');
        await client.query('BEGIN');
        await client.query('')
        await client.query('TRUNCATE TABLE flights RESTART IDENTITY');
        const stream = new Readable({
            read() {
                this.push(csvData); // 'data' should be your API data transformed into a CSV format or a concatenated string
                this.push(null); // Indicates the end of the stream
            }
        });
        const copyStream = client.query(copyFrom('COPY flights (hex, reg_number, flag, lat, lng, alt, dir, speed, v_speed, squawk, flight_number, flight_icao, flight_iata, dep_icao, dep_iata, arr_icao, arr_iata, airline_icao, airline_iata, aircraft_icao, updated, status, type) FROM STDIN WITH (FORMAT csv)'));
        
        stream.pipe(copyStream).on('finish', async () => {
            // Handle successful completion
            await client.query('COMMIT');
            console.log('commited');
            res.status(200).json({ message: 'Data successfully imported' });

        }).on('error', (error) => {
            // Handle error
            console.error('Error streaming data to PostgreSQL:', error);
            client.query('ROLLBACK');
            res.status(500).json({ message: error.message })

        });
    } finally {
        client.release();
    }
}

export default streamDataToPostgres;