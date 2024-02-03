import axios from 'axios';

const getFlightDataBbox = async (
        swLat: number | null, 
        swLng: number | null, 
        neLat: number | null, 
        neLng: number | null
    ): Promise<any> => {
    try {
        const endPoint = `${import.meta.env.VITE_API_URL}/api/flights/bbox`;
        const response = await axios.get(endPoint, {
            params: {
                minLat: swLat,
                maxLat: neLat,
                minLng: swLng,
                maxLng: neLng
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching flight data:', error);
        throw error;
    }
};

export default getFlightDataBbox;