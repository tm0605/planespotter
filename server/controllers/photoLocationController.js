import axios from 'axios';
import { scan, set } from '../models/planeSpotterRedis.js';
import dotenv from 'dotenv';
dotenv.config();

const parseLocation = (location) => {
    const title = location.title.replace(/\'/g, "\\'");
    const t = `<h5>${title}</h5>`
    const t_url = location.t_url;
    const p_url = location.p_url;
    return `${t}<a href="${p_url}"><img alt="${title}" src="${t_url}" width="250"/></a>`;
}

const getLocations = async (req, res) => {
    try {
        const icao = req.query.icao;
        const result = await scan(icao);
        if (result != null) {
            res.json(value);
            return;
        }

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
        const geoJson = {
            'type': 'FeatureCollection',
            'features': []
        };
        const locations = await Promise.all(locationPromises);
        // console.log(locations[0]);
        locations.forEach(location => {
            // const description = parseLocation(location);
            geoJson.features.push({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [location.longitude, location.latitude]
                },
                'properties': {
                    'id': location.id,
                    'owner': location.owner,
                    'title': location.title,
                    't_url': location.t_url,
                    'p_url': location.p_url,
                    'description': parseLocation(location)
                }
            })
        })
        await set(icao, geoJson);
        // console.log(locations[0]);
        // console.log(locaitons.filter(location => location != null));
        // res.json(locations.filter(location => location != null));
        res.json(geoJson);
        
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default getLocations;