import { useRef, useEffect, useState, useContext, ReactEventHandler } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Threebox } from 'threebox-plugin'; 
import { debounce } from 'lodash';
import getFlightData from '../services/flightService';
import getPhotoLocationAll from '../services/photoLocationService';
import sendActivity from '../services/activityService';
import FlightInfo from './FlightInfo'; 
import FlightContext from '../contexts/FlightContext';
import AirportContext from '../contexts/AirportContext';
import { error } from 'console';

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
        return updated;
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

const airportSelect = (map: mapboxgl.Map, iata_code: string) => {
    map.setPaintProperty('major-airports-circle', 'circle-color', 
    [
        'match',
        ['get', 'iata_code'],
        iata_code, '#8fffab',
        '#ffffff'
    ])
    map.setPaintProperty('major-airports-text', 'text-color',
    [
        'match',
        ['get', 'iata_code'],
        iata_code, '#8fffab',
        '#ffffff'
    ])
}

const airportUnselect = (map: mapboxgl.Map) => {
    map.setPaintProperty('major-airports-text', 'text-color', '#ffffff')
    map.setPaintProperty('major-airports-circle', 'circle-color', '#ffffff')
}

const Map = () => {
    const mapContainer = useRef<HTMLElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const mapLoaded = useRef<boolean>(false);
    // const threejsSceneRef = useRef<THREE.Scene>();
    // const threejsCameraRef = useRef<THREE.PerspectiveCamera>();
    // const threejsRendererRef = useRef<THREE.WebGLRenderer>();
    // const aircraftModelRef = useRef<THREE.Object3D>();
    const [lng, setLng] = useState<any>(139.7);
    const [lat, setLat] = useState<any>(35.5);
    const [zoom, setZoom] = useState<any>(9);
    const [pitch, setPitch] = useState<any>(0);
    const [bearing, setBearing] = useState<number>(0);
    let lastUpdateTimestamp = Date.now();
    const minZoomLevel = 8;

    const [visibleFlight, setVisibleFlight] = useState<any>({
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        138.61728795707023,
                        34.8979322596904
                    ]
                },
                "properties": {
                    "id": "780A19",
                    "flight": {
                        "hex": "780A19",
                        "reg_number": "B-KPX",
                        "flag": "HK",
                        "lat": 34.902325,
                        "lng": 138.628774,
                        "alt": 10924,
                        "dir": 245.5,
                        "speed": 740,
                        "v_speed": 0,
                        "squawk": null,
                        "flight_number": "881",
                        "flight_icao": "CPA881",
                        "flight_iata": "CX881",
                        "dep_icao": "KLAX",
                        "dep_iata": "LAX",
                        "arr_icao": "VHHH",
                        "arr_iata": "HKG",
                        "airline_icao": "CPA",
                        "airline_iata": "CX",
                        "aircraft_icao": "B77W",
                        "updated": 1708972679,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "CX881",
                    "rotation": 245
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        138.30747928015137,
                        35.443418618876116
                    ]
                },
                "properties": {
                    "id": "780AAD",
                    "flight": {
                        "hex": "780AAD",
                        "reg_number": "B-LRJ",
                        "flag": "HK",
                        "lat": 35.449461,
                        "lng": 138.318072,
                        "alt": 12158,
                        "dir": 235.7,
                        "speed": 750,
                        "v_speed": 0,
                        "squawk": null,
                        "flight_number": "873",
                        "flight_icao": "CPA873",
                        "flight_iata": "CX873",
                        "dep_icao": "KSFO",
                        "dep_iata": "SFO",
                        "arr_icao": "VHHH",
                        "arr_iata": "HKG",
                        "airline_icao": "CPA",
                        "airline_iata": "CX",
                        "aircraft_icao": "A359",
                        "updated": 1708972679,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "CX873",
                    "rotation": 235
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        139.5206573208894,
                        35.90528821293256
                    ]
                },
                "properties": {
                    "id": "AAC8A4",
                    "flight": {
                        "hex": "AAC8A4",
                        "reg_number": "N794UA",
                        "flag": "US",
                        "lat": 35.909613,
                        "lng": 139.53265,
                        "alt": 10200,
                        "dir": 246.1,
                        "speed": 757,
                        "v_speed": 0,
                        "squawk": null,
                        "flight_number": "853",
                        "flight_icao": "UAL853",
                        "flight_iata": "UA853",
                        "dep_icao": "KSFO",
                        "dep_iata": "SFO",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "UAL",
                        "airline_iata": "UA",
                        "aircraft_icao": "B772",
                        "updated": 1708972679,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "UA853",
                    "rotation": 246
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        139.39723563373767,
                        36.39442031831568
                    ]
                },
                "properties": {
                    "id": "780A8D",
                    "flight": {
                        "hex": "780A8D",
                        "reg_number": "B-KQT",
                        "flag": "HK",
                        "lat": 36.401079,
                        "lng": 139.407824,
                        "alt": 10817,
                        "dir": 232.8,
                        "speed": 770,
                        "v_speed": 3500,
                        "squawk": null,
                        "flight_number": "865",
                        "flight_icao": "CPA865",
                        "flight_iata": "CX865",
                        "dep_icao": "CYVR",
                        "dep_iata": "YVR",
                        "arr_icao": "VHHH",
                        "arr_iata": "HKG",
                        "airline_icao": "CPA",
                        "airline_iata": "CX",
                        "aircraft_icao": "B77W",
                        "updated": 1708972679,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "CX865",
                    "rotation": 232
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        140.19078076989817,
                        36.680928160840395
                    ]
                },
                "properties": {
                    "id": "899035",
                    "flight": {
                        "hex": "899035",
                        "reg_number": "B-16730",
                        "flag": "TW",
                        "lat": 36.686834,
                        "lng": 140.202121,
                        "alt": 11602,
                        "dir": 237,
                        "speed": 772,
                        "v_speed": null,
                        "squawk": null,
                        "flight_number": "17",
                        "flight_icao": "EVA17",
                        "flight_iata": "BR17",
                        "dep_icao": "KSFO",
                        "dep_iata": "SFO",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "EVA",
                        "airline_iata": "BR",
                        "aircraft_icao": "B77W",
                        "updated": 1708972663,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "BR17",
                    "rotation": 237
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        139.3650352588564,
                        35.074465486457775
                    ]
                },
                "properties": {
                    "id": "899039",
                    "flight": {
                        "hex": "899039",
                        "reg_number": "B-16735",
                        "flag": "TW",
                        "lat": 35.078428,
                        "lng": 139.376442,
                        "alt": 10992,
                        "dir": 247,
                        "speed": 722,
                        "v_speed": null,
                        "squawk": null,
                        "flight_number": "27",
                        "flight_icao": "EVA27",
                        "flight_iata": "BR27",
                        "dep_icao": "KSFO",
                        "dep_iata": "SFO",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "EVA",
                        "airline_iata": "BR",
                        "aircraft_icao": "B77W",
                        "updated": 1708972663,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "BR27",
                    "rotation": 247
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        141.11918573877207,
                        35.57872200487461
                    ]
                },
                "properties": {
                    "id": "89901C",
                    "flight": {
                        "hex": "89901C",
                        "reg_number": "B-18002",
                        "flag": "TW",
                        "lat": 35.581474,
                        "lng": 141.131814,
                        "alt": 10992,
                        "dir": 255,
                        "speed": 757,
                        "v_speed": null,
                        "squawk": null,
                        "flight_number": "7",
                        "flight_icao": "CAL7",
                        "flight_iata": "CI7",
                        "dep_icao": "KLAX",
                        "dep_iata": "LAX",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "CAL",
                        "airline_iata": "CI",
                        "aircraft_icao": "B77W",
                        "updated": 1708972661,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "CI7",
                    "rotation": 255
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        139.18645728308525,
                        36.00224195549958
                    ]
                },
                "properties": {
                    "id": "8991E5",
                    "flight": {
                        "hex": "8991E5",
                        "reg_number": "B-58502",
                        "flag": "TW",
                        "lat": 36.006846,
                        "lng": 139.197627,
                        "alt": 12219,
                        "dir": 243,
                        "speed": 722,
                        "v_speed": null,
                        "squawk": null,
                        "flight_number": "1",
                        "flight_icao": "SJX1",
                        "flight_iata": "JX1",
                        "dep_icao": "KLAX",
                        "dep_iata": "LAX",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "SJX",
                        "airline_iata": "JX",
                        "aircraft_icao": "A359",
                        "updated": 1708972659,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "JX1",
                    "rotation": 243
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        138.95347803751474,
                        34.90136572153969
                    ]
                },
                "properties": {
                    "id": "89901F",
                    "flight": {
                        "hex": "89901F",
                        "reg_number": "B-18006",
                        "flag": "TW",
                        "lat": 34.905438,
                        "lng": 138.965176,
                        "alt": 10383,
                        "dir": 247,
                        "speed": 742,
                        "v_speed": null,
                        "squawk": null,
                        "flight_number": "3",
                        "flight_icao": "CAL3",
                        "flight_iata": "CI3",
                        "dep_icao": "KSFO",
                        "dep_iata": "SFO",
                        "arr_icao": "RCTP",
                        "arr_iata": "TPE",
                        "airline_icao": "CAL",
                        "airline_iata": "CI",
                        "aircraft_icao": "B77W",
                        "updated": 1708972662,
                        "status": "en-route",
                        "type": "adsb"
                    },
                    "flight_iata": "CI3",
                    "rotation": 247
                }
            }
        ]
    });
    const [hoveringFlight, setHoveringFlight] = useState<any>(null);
    const { selectedFlight, setSelectedFlight } = useContext(FlightContext);
    const { selectedAirport, setSelectedAirport } = useContext(AirportContext);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        // sendActivity(); // Send activity to backend to update the database
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/takuya65/clr3rb0u800hi01pzapk738ag',
            center: [lng, lat],
            zoom: zoom
        });

        const tb = (window.tb = new Threebox(
            map.current,
            map.current.getCanvas().getContext('webgl'),
            { defaultLights: true }
        ));

        // Adding pitch control on the map
        map.current.addControl(new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: false
        }), 'bottom-right');
        
        map.current.on('move', () => {
            if (map.current) {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
                setPitch(map.current.getPitch());
                setBearing(map.current.getBearing());
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
            setVisibleFlight(await updateFlightLocation(map.current));
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

            mapLoaded.current = true;
        };

        animateAircraft(); // Activate flight animation
        })

        map.current.on('style.load', () => {

            map.current.addLayer({
                id: 'threebox',
                type: 'custom',
                renderingMode: '3d',
                onAdd: function () {
                    console.log('test', visibleFlight)
                    const scale = 200;
                    const options = {
                        obj: 'assets/plane.gltf',
                        type: 'gltf',
                        scale: {x: scale, y: scale, z: scale},
                        units: 'meters', 
                        rotation: { x: 90, y: -90, z: 0 }, // default rotation
                    };
                    tb.loadObj(options, (model: any) => {
                        model.setCoords([139.7797, 35.5523, (2000 / 50)]);
                        model.setRotation({ x: 0, y: 0, z: 0 + 90 });
                        tb.add(model);
                    });
                    visibleFlight.features.map((flight) => { // might need to add features.map
                        tb.loadObj(options, (model: any) => {
                            model.setCoords([flight.properties.flight.lng, flight.properties.flight.lat, (flight.properties.flight.alt / 50)]);
                            model.setRotation({ x: 0, y: 0, z: flight.properties.flight.dir + 90 });
                            tb.add(model);
                        });
                    })
                },
                render: function () {
                    tb.update();
                }
            })
        })

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        }).setMaxWidth("275px");

        // Trigger when map is moved
        map.current.on('moveend', async () => {
            setVisibleFlight(await updateFlightLocation(map.current));
            // updateSelectedFlightData();
        });

        // Trigger for a certain interval
        setInterval(async () => {
            setVisibleFlight(await updateFlightLocation(map.current));
            // updateSelectedFlightData();
        }, 15000);

        // Trigger when clicked
        map.current.on('click', (e) => {
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['flights', 'major-airports-circle']
            })
            if (features.length === 0) { // When layers other than flights and airports are selected
                setSelectedFlight(null);
                setSelectedAirport(null);
                removeLocation(map.current);
            }
        })

        map.current.on('mouseout', 'flights', (e) => {
            map.current.getCanvas().style.cursor = '';

            setHoveringFlight(null);
        })

        map.current.on('mouseenter', 'flights', (e) => {
            map.current.getCanvas().style.cursor = 'pointer';

            const flightData = JSON.parse(e.features[0].properties.flight);
            setHoveringFlight(flightData);
        })

        // Tirgger when clicked on flights
        map.current.on('click', 'flights', (e) => {
            const flightData = JSON.parse(e.features[0].properties.flight);
            setSelectedFlight(flightData);
        })

        //  Trigger when clicked on airports
        map.current.on('click', 'major-airports-circle', async (e) => {
            const airportData = e.features[0].properties
            airportData.lat = e.lngLat.lat;
            airportData.lng = e.lngLat.lng;
            setSelectedAirport(airportData);
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

    }, []);

    useEffect(() => {
        try {
        console.log(visibleFlight);
        } catch {

        }
    }, [visibleFlight])

    useEffect(() => {
        console.log('lat', lat);
        console.log('lng', lng);
        console.log('zoom', zoom);
        console.log('pitch', pitch);
        console.log('bearing', bearing);
    }, [lat, lng, zoom, pitch, bearing]);

    useEffect(() => {
        if (!mapLoaded.current) return;

        if (selectedFlight != null) { // If flight selected
            flightSelect(map.current, selectedFlight.hex)
            map.current.flyTo({
                center: [selectedFlight.lng, selectedFlight.lat],
                essential: true
            });
        } else flightUnselect(map.current);
    }, [selectedFlight])

    useEffect(() => {
        if (!mapLoaded.current) return; // If map not loaded

        if (selectedFlight != null) return; // If flight selected

        if (hoveringFlight != null) flightSelect(map.current, hoveringFlight.hex); // If flight hovered
        else flightUnselect(map.current);
    }, [hoveringFlight])

    useEffect(() => {
        if (!mapLoaded.current) return;

        if (selectedAirport != null) {
            airportSelect(map.current, selectedAirport.iata_code);
            getPhotoLocation(map.current, selectedAirport.lat, selectedAirport.lng);
            map.current.flyTo({
                center: [selectedAirport.lng, selectedAirport.lat],
                essential: false,
                zoom: 13,
            })
        } else airportUnselect(map.current);
    }, [selectedAirport])
    
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

export default Map;