import axios from 'axios';

const sendActivity = async (): Promise<any> => {
    try {
        const endPoint = `${import.meta.env.VITE_API_URL}/api/activity`;
        await axios.post(endPoint)
    } catch (error) {
        console.error('Error fetching flight data:', error);
        throw error;
    }
};

export default sendActivity;