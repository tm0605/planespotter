import { useState, useEffect } from 'react';
import getSearchResults from '../services/serchService';

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

    // const debounce = (func: Function, delay: number) => {
    //     let timer: NodeJS.Timeout;
    //     return function (...args: any) {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => {
    //             func(...args);
    //         }, delay);
    //     };
    // };

    const getSuggestions = async (searchQuery: string) => {
        setIsSearching(true);
        const response = await getSearchResults(searchQuery);
        
        console.log(response)
        setAirportSuggestions(response.airports);
        setFlightSuggestions(response.searchFlights)
        setIsSearching(false);
    };

    // const debounceGetSuggestions = debounce(getSuggestions, 1000);

    useEffect(() => {
            const handler = setTimeout(() => {
            if (input.length > 2) {
                getSuggestions(input);
            } else {
                setAirportSuggestions([]);
            }
        }, 500)

        return () => {
            clearTimeout(handler);
        };
    }, [input]);

    return (
        <div className='search-results'>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Search' />
            {isSearching && <div>Searching...</div>}
            <p>Airports</p>
            <ul>
                {airportSuggestions.map((suggestion, index) => (
                    // <li key={index}>{suggestion.name} ({suggestion.iata_code})</li>
                    <li key={index}>
                        <AirportSuggestion airport={suggestion} />
                    </li>
                ))}
            </ul>
            <p>Flights</p>
            <ul>
                {flightSuggestions.map((suggestion, index) => (
                    <li key={index}>
                        <FlightSuggestion flight={suggestion} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;