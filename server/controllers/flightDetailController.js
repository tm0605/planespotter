// retrieves flights from db
import pool from '../models/planeSpotterDB.js';
import pkg from 'pg';
const { types } = pkg;

// const convertGeoJson = (flights) => {
//     const geoJson = {
//         'type': 'FeatureCollection',
//         'features': []
//     };
    
//     flights.forEach(flight => {
//         geoJson.features.push({
//             'type': 'Feature',
//             'geometry': {
//                 'type': 'Point',
//                 'coordinates': [flight.lng, flight.lat]
//             },
//             'properties': {
//                 'id': flight.hex,
//                 'flight': flight,
//                 'flight_iata': flight.flight_iata,
//                 'rotation': parseInt(flight.dir)
//             },
//         })
//     })
//     return geoJson;
// }

const getFlightDetail = async (req, res) => {
    const hex = req.query.hex;
    // const maxLat = req.query.maxLat;
    // const minLng = req.query.minLng;
    // const maxLng = req.query.maxLng;

    const query = `
        SELECT * FROM flights
        WHERE hex = $1
    `;

    const values = [hex];

    try {
        // PostgreSQL type ID for numeric fields (e.g., 1700 for numeric)
        types.setTypeParser(1700, (val) => parseFloat(val));

        // For integers, you might want to ensure they are parsed as int (e.g., type ID 20 for bigint)
        types.setTypeParser(20, (val) => parseInt(val, 10));

        const response = await pool.query(query, values);
        const flight = response.rows;
        if (flight.length != 0) {
            const depAirport = await pool.query('SELECT * FROM airports WHERE icao_code = $1', [flight[0].dep_icao]);
            const arrAirport = await pool.query('SELECT * FROM flights WHERE icao_code = $1', [flight[0].arr_icao]);
            flight[0].dep = depAirport;
            flight[0].arr = arrAirport;
            res.status(200).json(flight[0])
        } else {
            res.status(204).json({ message: 'No flights found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default getFlightDetail;
