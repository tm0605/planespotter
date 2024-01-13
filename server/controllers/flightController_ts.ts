import { Request, Response } from 'express';
import axios from 'axios';

console.log('flightController');
const getFlightsAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log('reached getFlights');
        const response = await axios.get('https://airlabs.co/api/v9/flights', {
            params: {
                api_key: process.env.AIRLABS_API_KEY,
                bbox: null
            }
        })
        // .then(response => {
        //     console.log(response.data);
        // })
        // .catch(error => {
        //     console.error(error);
        // })
        res.json(response.data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default getFlightsAll;