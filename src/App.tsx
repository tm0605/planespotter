import { useState } from 'react';
import Map from './components/Map';
import { NavBar, InfoBar } from './components/NavBar';
import FlightContext from './contexts/FlightContext';

export default function App() {

    const [selectedFlight, setSelectedFlight] = useState(null)

    return (
        <>
            <NavBar />
            {/* <InfoBar /> */}
            <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
                <Map />
            </FlightContext.Provider>
        </>
    );
}
