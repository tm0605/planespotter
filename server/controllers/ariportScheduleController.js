import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getFlightsAll = async (icao) => {
    try {        
        const depResponse = await axios.get('https://airlabs.co/api/v9/schedules', {
            params: {
                api_key: process.env.AIRLABS_API_KEY,
                dep_icao: icao
            }
        });

        const depFlights = depResponse.data.response;

        const arrResponse = await axios.get('https://airlabs.co/api/v9/schedules', {
            params: {
                api_key: process.env.AIRLABS_API_KEY,
                arr_icao: icao
            }
        })

        const arrFlights = arrResponse.data.response;
        
        // return flights
        
    }
    catch (error) {
        console.error(error);
    }
};

export default getFlightsAll;
