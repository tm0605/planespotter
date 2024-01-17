import { createContext } from 'react';

interface FlightData {
    flight_icao: string;
    flight_iata: string;
    dep_icao: string;
    dep_iata: string;
    arr_icao: string;
    arr_iata: string;
    aircraft_icao: string;
    reg_number: string;
    alt: number;
    v_speed: number;
    speed: number;
    dir: number;
    lat: number;
    lng: number;
    squawk: number;
}

interface FlightContextType {
    selectedFlight: FlightData | null; // Replace FlightData with your flight data type
    setSelectedFlight: (flight: FlightData | null) => void;
}

const FlightContext = createContext<FlightContextType>({
    selectedFlight: null,
    setSelectedFlight: () => {}
});
export default FlightContext;