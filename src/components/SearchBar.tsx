import { useState, useEffect, useRef } from 'react';
import getSearchResults from '../services/serchService';
// import { setSourceMapsEnabled } from 'process';

const AirportSuggestion = ({ airport }) => {
    return (
        <div>
            <strong>{airport.name}</strong> ({airport.iata_code})
            {/* Locaiton: {airport.lat}, {airport.lng}
            Country: {airport.country_code} */}
        </div>
    );
};

const FlightSuggestion = ({ flight }) => {
    return (
        <div>
            <strong>{flight.flight_icao}</strong> ({flight.dep_iata}-{flight.arr_iata})
        </div>
    )
}

const SearchBar = () => {
    const [input, setInput] = useState('');
    const [airportSuggestions, setAirportSuggestions] = useState<string[]>([]);
    const [flightSuggestions, setFlightSuggestions] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getSuggestions = async (searchQuery: string) => {
        setIsSearching(true);
        setAirportSuggestions([]);
        setFlightSuggestions([]);

        const response = await getSearchResults(searchQuery);
        
        setAirportSuggestions(response.airports);
        setFlightSuggestions(response.searchFlights)
        setIsSearching(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setInput('');
                setAirportSuggestions([]);
                setFlightSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
            const handler = setTimeout(() => {
            if (input.length > 2) {
                getSuggestions(input);
                setHasSearched(true);
            } else {
                setAirportSuggestions([]);
                setFlightSuggestions([]);
                setHasSearched(false);
            }
        }, 500)

        return () => {
            clearTimeout(handler);
        };
    }, [input]);

    return (
        <div className='searchbar'>
            <input ref={inputRef} type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Search' />
            <div className='searchresults'>
                {isSearching && <div>Searching...</div>}
                {!isSearching && hasSearched && airportSuggestions.length == 0 && flightSuggestions.length == 0 && (
                    <p>No Results Found</p>
                )}
                {airportSuggestions.length > 0 && (
                <div className='airport'>
                    <p>Airports</p>
                    <ul>
                        {airportSuggestions.map((suggestion, index) => (
                            // <li key={index}>{suggestion.name} ({suggestion.iata_code})</li>
                            <li key={index}>
                                <AirportSuggestion airport={suggestion} />
                            </li>
                        ))}
                    </ul>
                </div>)}
                {flightSuggestions.length > 0 && (
                <div className='flight'>
                    <p>Real-Time Flights</p>
                    <ul>
                        {flightSuggestions.map((suggestion, index) => (
                            <li key={index}>
                                <FlightSuggestion flight={suggestion} />
                            </li>
                        ))}
                    </ul>
                </div>)}
            </div>
        </div>
    );
};

export default SearchBar;