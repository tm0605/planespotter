import axios from "axios";

const getSearchResults = async (query: string): Promise<any> => {
    try {
        const endPoint = `${import.meta.env.VITE_API_URL}/search`;
        const response = await axios.get(endPoint, {
            params: {
                searchQuery: query
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};

export default getSearchResults;