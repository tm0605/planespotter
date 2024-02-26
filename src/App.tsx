import { useState } from 'react';
import Map from './components/Map';
import NavBar from './components/NavBar';
import FlightContext from './contexts/FlightContext';
import AirportContext from './contexts/AirportContext';

export default function App() {

    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedAirport, setSelectedAirport] = useState(null);

    return (
        <>
            <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
            <AirportContext.Provider value={{ selectedAirport, setSelectedAirport }}>
                <header>
                    <NavBar />
                </header>

                <main>
                    <Map />
                </main>
            </AirportContext.Provider>
            </FlightContext.Provider>
            
        </>
    );
}
