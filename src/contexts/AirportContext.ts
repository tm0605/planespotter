import { createContext } from 'react';

interface AirportData {
    name: string;
    iata_code: string;
    icao_code: string;
    lat: number;
    lng: number;
    country_code: string;
}

interface AirportContextType {
    selectedAirport: AirportData | null;
    setSelectedAirport: (airport: AirportData | null) => void;
}

const AirportContext = createContext<AirportContextType>({
    selectedAirport: null,
    setSelectedAirport: () => {}
});
export default AirportContext;