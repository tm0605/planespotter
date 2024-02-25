import { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { debounce } from 'lodash';
// import WebSocket from 'ws';
import getFlightData from '../services/flightService';
import getPhotoLocationAll from '../services/photoLocationService';
import sendActivity from '../services/activityService';
import { FlightInfo } from './FlightInfo'; 
import FlightContext from '../contexts/FlightContext';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN || 'XXXX';

// Get Flight Updates and Set Data
const updateFlightLocation  = async (map: mapboxgl.Map) => {
    const swLat = map.getBounds()._sw.lat;
    const swLng = map.getBounds()._sw.lng;
    const neLat = map.getBounds()._ne.lat;
    const neLng = map.getBounds()._ne.lng;

    const geojson = await getFlightData(swLat, swLng, neLat, neLng);
    
    if (geojson != '') {
        const lastUpdateTimestamp = geojson.features[0].properties.flight.updated * 1000;
        const timeElapsed = (Date.now() - lastUpdateTimestamp) / 1000; // Calculate time elapsed since flight updated

        const updated = calculateFlightLocation(geojson, timeElapsed) // Calculate estimated location

        map.getSource('flights').setData(updated);
    }
}

// Calculate estimated flight locaiton
const calculateFlightLocation = (data, timeElapsed: number) => {
    if (timeElapsed > (60 * 30)) return data;

    data.features.map((flight) => {
        const speed = flight.properties.flight.speed;
        const distance = speed * (timeElapsed / 3600);

        const coords = flight.geometry.coordinates;
        const heading = flight.properties.rotation;
        
        const headingRad = heading * (Math.PI / 180);

        const deltaLat = (distance * Math.cos(headingRad)) / 111.32;
        const deltaLng = (distance * Math.sin(headingRad)) / (111.32 * Math.cos(coords[1] * (Math.PI / 180)));

        const newLat = coords[1] + deltaLat;
        const newLng = coords[0] + deltaLng;

        flight.geometry.coordinates = [newLng, newLat];

    })

    return data;
}

// Get spotting locaiton and set data
const getPhotoLocation = async (map: mapboxgl.Map, lat: number, lng: number) => {
    const geojson = await getPhotoLocationAll(lat, lng);

    if (geojson != '') {
        map.getSource('spottingLocations').setData(geojson);
    }
}

// Remove spotting location from the map
const removeLocation = (map: mapboxgl.Map) => {
    map.getSource('spottingLocations').setData({
        'type': 'FeatureCollection',
        'features': []
    });
}

const flightSelect = (map: mapboxgl.Map, hex: string) => {
    map.setLayoutProperty('flights', 'icon-image',
    [
        'match',
        ['get', 'id'],
        hex, 'small_plane_selected',
        'small_plane'
    ])
    map.setPaintProperty('flights', 'text-color',
    [
        'match',
        ['get', 'id'],
        hex, '#8fffab',
        '#ffffff'
    ])
}

const flightUnselect = (map: mapboxgl.Map) => {
    map.setLayoutProperty('flights', 'icon-image', 'small_plane')
    map.setPaintProperty('flights', 'text-color', '#ffffff')
}

const airportSelect = (map: mapboxgl.Map, e: mapboxgl.MapMouseEvent) => {
    map.setPaintProperty('major-airports-circle', 'circle-color', 
    [
        'match',
        ['get', 'iata_code'],
        e.features[0].properties.iata_code, '#8fffab',
        '#ffffff'
    ])
    map.setPaintProperty('major-airports-text', 'text-color',
    [
        'match',
        ['get', 'iata_code'],
        e.features[0].properties.iata_code, '#8fffab',
        '#ffffff'
    ])
}

const airportUnselect = (map: mapboxgl.Map) => {
    map.setPaintProperty('major-airports-text', 'text-color', '#ffffff')
    map.setPaintProperty('major-airports-circle', 'circle-color', '#ffffff')
}

export default function Map() {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<any>(-70.9);
    const [lat, setLat] = useState<any>(42.35);
    const [zoom, setZoom] = useState<any>(9);
    let lastUpdateTimestamp = Date.now();
    const minZoomLevel = 8;

    const { selectedFlight, setSelectedFlight } = useContext(FlightContext);
    const selectedFlightRef = useRef(selectedFlight);

    useEffect(() => {
        selectedFlightRef.current = selectedFlight;
    }, [selectedFlight]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        sendActivity(); // Send activity to backend to update the database
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/takuya65/clr3rb0u800hi01pzapk738ag',
            center: [lng, lat],
            zoom: zoom
        });

        // Adding pitch control on the map
        map.current.addControl(new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: false
        }), 'bottom-right')
        
        map.current.on('move', () => {
            if (map.current) {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            }
        });

        // When loading
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
                    // 'icon-size': 1,
                    'icon-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        3, .5,
                        5, 1
                    ],
                    'text-field': ['get', 'flight_iata'],
                    'text-size': 13,
                    'text-offset': [0, 1.7],
                    'text-optional': true,
                    'text-font': ['DIN Pro Bold']
                },
                'paint': {
                    'text-color': '#ffffff',
                    'text-halo-color': 'black',
                    'text-halo-width': .7,
                    'text-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        4.9, 0,
                        5, 1
                    ]
                }
            });
            updateFlightLocation(map.current);
            map.current.addSource('spottingLocations', {
                type: 'geojson',
                data: null
            });
            map.current.addLayer({
                'id': 'spottingLocations',
                'type': 'symbol',
                'source': 'spottingLocations',
                'layout': {
                    'icon-image': 'attraction',
                    'icon-padding': 0,
                    'icon-allow-overlap': true
                }
            })

        
        const animateAircraft = () => {
            const data = map.current.getSource('flights')._data;
            const now = Date.now();
            const updateRate = map.current.getZoom() >= minZoomLevel ? 100 : 500; // Rapid update when zoomed
            const timeElapsed = (now - lastUpdateTimestamp) / 1000;
            
            // If planes are within the map and not zoomed out too far
            if (data != null && map.current.getZoom() > 4.5) {

                const updated = calculateFlightLocation(data, timeElapsed); // Calculate estimated location
                
                map.current.getSource('flights').setData(updated); // Update plane location for animation
            }
            lastUpdateTimestamp = now;
        
            setTimeout(animateAircraft, updateRate) // Set update rate
        };

        animateAircraft(); // Activate flight animation
        })

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        }).setMaxWidth("275px");

        // Update the information on the sidebar if aircraft selected
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
            updateFlightLocation(map.current);
            updateSelectedFlightData();
        });

        // Trigger for a certain interval
        setInterval(async () => {
            updateFlightLocation(map.current);
            updateSelectedFlightData();
        }, 15000);

        // Trigger when clicked
        map.current.on('click', (e) => {
            flightUnselect(map.current);
            airportUnselect(map.current);
            setSelectedFlight(null);
            removeLocation(map.current);
        })

        map.current.on('mouseleave', 'flights', (e) => {
            if (selectedFlightRef.current == null) {
                flightUnselect(map.current);
            }
        })

        map.current.on('mouseover', 'flights', (e) => {
            if (selectedFlightRef.current == null) {
                flightSelect(map.current, e);
            }
        })

        // Tirgger when clicked on flights
        map.current.on('click', 'flights', (e) => {
            // flightSelect(map.current, e);
            const flightData = JSON.parse(e.features[0].properties.flight);
            setSelectedFlight(flightData);
        })

        //  Trigger when clicked on airports
        map.current.on('click', 'major-airports-circle', async (e) => {
            airportSelect(map.current, e);
            getPhotoLocation(map.current, e.lngLat.lat, e.lngLat.lng);
        })

        // Trigger when hovering on spotting locations
        map.current.on('mouseenter', 'spottingLocations', (e) => {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = 'pointer';
        
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
        })

        // Trigger when hovering out of spotting locations
        map.current.on('mouseleave', 'spottingLocations', (e) => {
            map.current.getCanvas().style.cursor = '';
            popup.remove();
        })

    }, [lng, lat, zoom]);

    useEffect(() => {
        // if (map.current) return; // initialize map only once
        if (selectedFlight == null && map.current != null) {
            // console.log('hi')
            // flightUnselect(map.current);
        }
        if (selectedFlight != null) {
            flightSelect(map.current, selectedFlight.hex)
            map.current.flyTo({
                center: [selectedFlight.lng, selectedFlight.lat],
                essential: true
            });
        }
    }, [selectedFlight])
    
    useEffect(() => {
        const handleUserActivity = debounce(() => {
            // sendActivity();
        }, 1000);
    
        // Listen for mouse and key events
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
    
        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            handleUserActivity.cancel()
        };
    }, []);

    return (
        <>
            <div ref={mapContainer} className='map-container' />
            <FlightInfo />
        </>
    )
}