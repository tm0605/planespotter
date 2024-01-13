import axios from 'axios';

const getFlightDataAll = async (
        swLat: number | null, 
        swLng: number | null, 
        neLat: number | null, 
        neLng: number | null
    ): Promise<any> => {
    try {
        const endPoint = `${import.meta.env.VITE_API_URL}/api/flights/all`;
        const response = await axios.get(endPoint, {
            params: {
                bbox: `${swLat},${swLng},${neLat},${neLng}`
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching flight data:', error);
        throw error;
    }
};

export default getFlightDataAll;