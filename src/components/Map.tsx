import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import getFlightDataAll from '../services/flightServiceAll';
import { response } from 'express';

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

export function Map() {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<any>(-70.9);
    const [lat, setLat] = useState<any>(42.35);
    const [zoom, setZoom] = useState<any>(9);


    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/takuya65/clr3rb0u800hi01pzapk738ag',
            center: [lng, lat],
            zoom: zoom
        });
        
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
                    'icon-image': 'airport',
                    'icon-rotate': ['get', 'rotation'],
                    'icon-allow-overlap': true,
                    'icon-rotation-alignment': 'map'
                }
            });

            const swLat = map.current.getBounds()._sw.lat;
            const swLng = map.current.getBounds()._sw.lng;
            const neLat = map.current.getBounds()._ne.lat;
            const neLng = map.current.getBounds()._ne.lng;
        
            const geojson = await getFlightDataAll(swLat, swLng, neLat, neLng);
            
            if (geojson != '') {
                map.current.getSource('flights').setData(geojson);
            }
        })

        map.current.on('moveend', async () => {
            const swLat = map.current.getBounds()._sw.lat;
            const swLng = map.current.getBounds()._sw.lng;
            const neLat = map.current.getBounds()._ne.lat;
            const neLng = map.current.getBounds()._ne.lng;

            const geojson = await getFlightDataAll(swLat, swLng, neLat, neLng);

            
            if (geojson != '') {
                map.current.getSource('flights').setData(geojson);
            }
        });

        map.current.addControl(new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: false
        }))

        setInterval(async () => {
            const swLat = map.current.getBounds()._sw.lat;
            const swLng = map.current.getBounds()._sw.lng;
            const neLat = map.current.getBounds()._ne.lat;
            const neLng = map.current.getBounds()._ne.lng;

            const geojson = await getFlightDataAll(swLat, swLng, neLat, neLng);
            // console.log(geojson)
            
            if (geojson != '') {
                map.current.getSource('flights').setData(geojson);
            }
        }, 10000);

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
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className='map-container'  style={{width: '100vw', height: '100vh'}} />
        </div>
    )
}