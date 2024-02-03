// retrieves flights from db
import pool from '../models/planeSpotterDB.js';
import pkg from 'pg';
const { types } = pkg;

const convertGeoJson = (flights) => {
    const geoJson = {
        'type': 'FeatureCollection',
        'features': []
    };
    
    flights.forEach(flight => {
        geoJson.features.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [flight.lng, flight.lat]
            },
            'properties': {
                'id': flight.hex,
                'flight': flight,
                'flight_iata': flight.flight_iata,
                'rotation': parseInt(flight.dir)
            },
        })
    })
    return geoJson;
}

const getFlightsBoundingBox = async (req, res) => {
    // const bbox = req.query.bbox;
    const minLat = req.query.minLat;
    const maxLat = req.query.maxLat;
    const minLng = req.query.minLng;
    const maxLng = req.query.maxLng;

    const query = `
        SELECT * FROM flights
        WHERE lat BETWEEN ${minLat} AND ${maxLat}
        AND lng BETWEEN ${minLng} AND ${maxLng};
    `;

    try {
        // PostgreSQL type ID for numeric fields (e.g., 1700 for numeric)
        types.setTypeParser(1700, (val) => parseFloat(val));

        // For integers, you might want to ensure they are parsed as int (e.g., type ID 20 for bigint)
        types.setTypeParser(20, (val) => parseInt(val, 10));

        const response = await pool.query(query);
        const flights = response.rows;
        
        if (flights.length > 0) {
            const geoJson = convertGeoJson(flights);
            res.json(geoJson);
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

export default getFlightsBoundingBox;
