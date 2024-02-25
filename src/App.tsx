import { useState } from 'react';
import Map from './components/Map';
import NavBar from './components/NavBar';
import FlightContext from './contexts/FlightContext';

export default function App() {

    const [selectedFlight, setSelectedFlight] = useState(null)

    return (
        <>
            <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
                <header>
                    <NavBar />
                </header>

                <main>
                    <Map />
                </main>
            </FlightContext.Provider>
        </>
    );
}
