import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getFlightsAll = async () => {
    try {        
        const response = await axios.get('https://airlabs.co/api/v9/flights', {
            params: {
                api_key: process.env.AIRLABS_API_KEY
            }
        });

        const flights = response.data.response;
        
        return flights
        
    }
    catch (error) {
        console.error(error);
    }
};

export default getFlightsAll;
