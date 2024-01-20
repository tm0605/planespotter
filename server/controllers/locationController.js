import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getLocations = async (req, res) => {
    try {
        // retrieve lat lng value
        const lat = req.query.lat;
        const lng = req.query.lng;
        
        // retrieve photos
        const photoResponse = await axios.get('https://www.flickr.com/services/rest/', {
            params: {
                method: 'flickr.photos.search',
                api_key: process.env.FLICKR_API_KEY,
                text: 'airplanes',
                media: 'photos',
                lat: lat,
                lon: lng,
                format: 'json',
                min_taken_date: '2015-01-01',
                sort: 'relevance',
                radius: 5,
                tag_mode: 'all',
                nojsoncallback: 1
            }
        });

        const searchData = photoResponse.data;

        if (searchData.length == 0) {
            res.status(204).json({ message: 'No Photos found' });
        }

        const locations = [];
        const tasks =[];
        for (let photo of searchData.photos.photo) {
            const geoResponse = await axios.get('https://www.flickr.com/services/rest/', {
                params: {
                    method: 'flickr.photos.geo.getLocation',
                    api_key: process.env.FLICKR_API_KEY,
                    photo_id: photo.id,
                    format: 'json',
                    nojsoncallback: 1
                }
            })
            const data = geoResponse.data;
            const lat = data.photo.location.latitude;
            const lon = data.photo.location.longitude;
            const location = {
                latitude: lat,
                longitude: lon
            };
            locations.push(location);
        }
        
        res.json(locations);
        
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default getLocations;