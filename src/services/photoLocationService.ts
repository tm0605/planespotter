import axios from 'axios';

const getPhotoLocationAll = async (
        icao: string | null,
        lat: number | null, 
        lng: number | null
    ): Promise<any> => {
    try {
        const endPoint = `${import.meta.env.VITE_API_URL}/photo/locationsAll`;
        const response = await axios.get(endPoint, {
            params: {
                icao: icao,
                lat: lat,
                lng: lng
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching flight data:', error);
        throw error;
    }
};

export default getPhotoLocationAll;