import pool from '../models/planeSpotterDB.js';

const searchAirports = async (searchQuery) => {
    const query = `
        SELECT * FROM airports
        WHERE name ILIKE '%' || $1 || '%'
        OR iata_code ILIKE '%' || $1 || '%'
        OR icao_code ILIKE '%' || $1 || '%';
    `;

    const values = [searchQuery];

    const response = await pool.query(query, values);
    return response.rows;
}

const searchFlights = async (searchQuery) => {
    const query = `
        SELECT * FROM flights
        WHERE reg_number ILIKE '%' || $1 || '%'
        OR flight_number ILIKE '%' || $1 || '%'
        OR flight_icao ILIKE '%' || $1 || '%'
        OR flight_iata ILIKE '%' || $1 || '%';
    `;

    const values = [searchQuery];

    const response = await pool.query(query, values);
    return response.rows;
}

const getSearchResults = async (req, res) => {
    const searchQuery = req.query.searchQuery;

    const airportRes = await searchAirports(searchQuery);
    const flightRes = await searchFlights(searchQuery);
    res.status(200).json({ airports: airportRes, flights: flightRes});
}

export default getSearchResults;