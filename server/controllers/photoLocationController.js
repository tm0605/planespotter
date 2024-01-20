import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getLocations = async (req, res) => {
    try {
        // retrieve lat lng value from query
        const lat = req.query.lat;
        const lng = req.query.lng;
        
        // retrieve relevant photos around the area
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
        // console.log(searchData.photos.photo)

        if (searchData.length == 0) {
            res.status(204).json({ message: 'No Photos found' });
            return;
        }

        const locationPromises = searchData.photos.photo.map(photo => {
            return axios.get('https://www.flickr.com/services/rest/', {
                params: {
                    method: 'flickr.photos.geo.getLocation',
                    api_key: process.env.FLICKR_API_KEY,
                    photo_id: photo.id,
                    format: 'json',
                    nojsoncallback: 1
                }
            }).then(geoResponse => {
                const data = geoResponse.data;
                return {
                    id: photo.id,
                    owner: photo.owner,
                    title: photo.title,
                    t_url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
                    p_url: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`,
                    latitude: data.photo.location.latitude,
                    longitude: data.photo.location.longitude
                };
            }).catch(error => {
                console.error('Error fetching location for photo id:', photo.id, error);
                return null;
            });
        });

        const locations = await Promise.all(locationPromises);
        res.json(locations.filter(location => location != null));
        
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default getLocations;