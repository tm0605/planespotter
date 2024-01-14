import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

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
                'flight': flight,
                'flight_iata': flight.flight_iata,
                'rotation': parseInt(flight.dir)
            }
        })
    })
    return geoJson;
}

const getFlightsAll = async (req, res) => {
    try {
        const bbox = req.query.bbox;
        
        const response = await axios.get('https://airlabs.co/api/v9/flights', {
            params: {
                api_key: process.env.AIRLABS_API_KEY,
                bbox: bbox
            }
        });

        const flights = response.data.response;

        if (flights.length > 0) {
            const geoJson = convertGeoJson(flights);
            res.json(geoJson);
        } else {
            res.status(404).json({ message: 'No flights found' });
        }
        
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default getFlightsAll;
