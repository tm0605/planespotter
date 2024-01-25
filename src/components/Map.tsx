import { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import getFlightDataAll from '../services/flightServiceAll';
import getPhotoLocationAll from '../services/photoLocationService';
import { FlightInfo } from './FlightInfo'; 
import FlightContext from '../contexts/FlightContext';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN || 'XXXX';

const updateFlight  = async (map) => {
    const swLat = map.current.getBounds()._sw.lat;
    const swLng = map.current.getBounds()._sw.lng;
    const neLat = map.current.getBounds()._ne.lat;
    const neLng = map.current.getBounds()._ne.lng;

    const geojson = await getFlightDataAll(swLat, swLng, neLat, neLng);
    
    if (geojson != '') {
        map.current.getSource('flights').setData(geojson);
    }
}

const updateLocation = async (map, lat: number, lng: number) => {
    const geojson = await getPhotoLocationAll(lat, lng);

    if (geojson != '') {
        map.current.getSource('spottingLocations').setData(geojson);
    }
}

export function Map() {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<any>(-70.9);
    const [lat, setLat] = useState<any>(42.35);
    const [zoom, setZoom] = useState<any>(9);

    const { selectedFlight, setSelectedFlight } = useContext(FlightContext);
    const selectedFlightRef = useRef(selectedFlight);

    useEffect(() => {
        selectedFlightRef.current = selectedFlight;
    }, [selectedFlight]);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/takuya65/clr3rb0u800hi01pzapk738ag',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: false
        }))
        
        map.current.on('move', () => {
            if (map.current) {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            }
        });

        map.current.on('load', async () => {
            map.current.addSource('flights', {
                type: 'geojson',
                data: null
            });
            map.current.addLayer({
                'id': 'flights',
                'type': 'symbol',
                'source': 'flights',
                'layout': {
                    'icon-image': 'small_plane',
                    'icon-rotate': ['get', 'rotation'],
                    'icon-allow-overlap': true,
                    'icon-rotation-alignment': 'map',
                    'icon-size': 1
                }
            });
            updateFlight(map);
            map.current.addSource('spottingLocations', {
                type: 'geojson',
                data: null
            });
            map.current.addLayer({
                'id': 'spottingLocations',
                'type': 'symbol',
                'source': 'spottingLocations',
                'layout': {
                    'icon-image': 'rocket'
                }
            })
        })

        const updateSelectedFlightData = () => {
            if (selectedFlightRef.current == null) return;
            const sourceData = map.current.getSource('flights')._data;
            const updatedFlight = sourceData.features.find(flight => flight.properties.id === selectedFlightRef.current.hex);

            if (updatedFlight) {
                setSelectedFlight(updatedFlight.properties.flight);
            }
        }

        // Trigger when map is moved
        map.current.on('moveend', async () => {
            updateFlight(map);
            updateSelectedFlightData();
        });

        // Trigger for a certain interval
        setInterval(async () => {
            updateFlight(map);
            updateSelectedFlightData();
        }, 10000);

        // Trigger when clicked
        map.current.on('click', (e) => {
            map.current.setLayoutProperty('flights', 'icon-image', 'small_plane')
            map.current.setPaintProperty('major-airports-text', 'text-color', '#ffffff')
            map.current.setPaintProperty('major-airports-circle', 'circle-color', '#ffffff')
            setSelectedFlight(null);
            map.current.getSource('spottingLocations').setData({
                'type': 'FeatureCollection',
                'features': []
            });
        })

        // Tirgger when clicked on flights
        map.current.on('click', 'flights', (e) => {
            map.current.setLayoutProperty('flights', 'icon-image',
            [
                'match',
                ['get', 'id'],
                e.features[0].properties.id, 'small_plane_selected',
                'small_plane'
            ])
            const flightData = JSON.parse(e.features[0].properties.flight);
            setSelectedFlight(flightData);
        })

        map.current.on('click', 'major-airports-circle', async (e) => {
            // console.log(e.lngLat.lat)
            map.current.setPaintProperty('major-airports-circle', 'circle-color', 
            [
                'match',
                ['get', 'iata_code'],
                e.features[0].properties.iata_code, '#8fffab',
                '#ffffff'
            ])
            map.current.setPaintProperty('major-airports-text', 'text-color',
            [
                'match',
                ['get', 'iata_code'],
                e.features[0].properties.iata_code, '#8fffab',
                '#ffffff'
            ])
            updateLocation(map, e.lngLat.lat, e.lngLat.lng);
            // console.log(data);
        })

    }, [lng, lat, zoom]);

    useEffect(() => {
        const firstNavbar = document.querySelectorAll('.navbar')[0] as HTMLElement; // Select the navbar element
        // const secondNavbar = document.querySelectorAll('.navbar')[1] as HTMLElement;
        // if (firstNavbar && secondNavbar) {
        if (firstNavbar) {
            const navbarHeight = firstNavbar.offsetHeight; // Get the height of the navbar
            // const navbarHeight = firstNavbar.offsetHeight + secondNavbar.offsetHeight; // Get the height of the navbar
            mapContainer.current.style.height = `calc(100vh - ${navbarHeight}px)`; // Set the height of the map container
        }
    }, []); // Empty dependency array ensures this runs once after the first render
    
    return (
        <div>
            <FlightInfo />
            <div ref={mapContainer} className='map-container'  style={{width: '100vw', height: '100vh'}} />
        </div>
    )
}