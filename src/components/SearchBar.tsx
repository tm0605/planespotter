import { useState, useEffect, useRef, useContext } from 'react';
import getSearchResults from '../services/serchService';
import FlightContext from '../contexts/FlightContext';
import AirportContext from '../contexts/AirportContext';

const AirportSuggestion = ({ airport, searchTerm }) => {
    const highlightText = (text: string) => {
        if (!searchTerm) return text;

        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === searchTerm.toLowerCase() ? <strong key={index}>{part}</strong> : part
        )
    }
    return (
        <div>
            {highlightText(airport.name)} ({highlightText(airport.iata_code)} | {highlightText(airport.icao_code)})
        </div>
    );
};

const FlightSuggestion = ({ flight, searchTerm }) => {
    const highlightText = (text: string) => {
        if (!searchTerm) return text;

        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === searchTerm.toLowerCase() ? <strong key={index}>{part}</strong> : part
        )
    }
    return (
        <div>
            {highlightText(flight.flight_icao)} ({highlightText(flight.dep_iata)}-{highlightText(flight.arr_iata)}) ({highlightText(flight.reg_number)})
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
    
    const { setSelectedFlight } = useContext(FlightContext);
    const { setSelectedAirport } = useContext(AirportContext);

    const handleClickFlight = (data) => {
        setSelectedFlight(data);
        setInput('');
    }

    const handleClickAirport = (data) => {
        setSelectedAirport(data);
        setInput('');
    }
    
    const getSuggestions = async (searchQuery: string) => {
        setIsSearching(true);
        setAirportSuggestions([]);
        setFlightSuggestions([]);

        const response = await getSearchResults(searchQuery);
        
        setAirportSuggestions(response.airports);
        setFlightSuggestions(response.flights);
        setIsSearching(false);
    };


    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setInput('');
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
        }, 200)

        return () => {
            clearTimeout(handler);
        };
    }, [input]);

    return (
        <div ref={inputRef} className='searchbar'>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Search Flights or Airports' />
            <div className='searchresults'>
                {isSearching && <div>Searching...</div>}
                {!isSearching && hasSearched && airportSuggestions.length == 0 && flightSuggestions.length == 0 && (
                    <p>No Results Found</p>
                )}
                {airportSuggestions.length > 0 && (
                <div className='airport'>
                    <p>Airports ({airportSuggestions.length} results)</p>
                    <ul>
                        {airportSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleClickAirport(suggestion)}>
                                <AirportSuggestion airport={suggestion} searchTerm={input} />
                            </li>
                        ))}
                    </ul>
                </div>)}
                {flightSuggestions.length > 0 && (
                <div className='flight'>
                    <p>Real-Time Flights ({flightSuggestions.length} results)</p>
                    <ul>
                        {flightSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleClickFlight(suggestion)}>
                                <FlightSuggestion flight={suggestion} searchTerm={input} />
                            </li>
                        ))}
                    </ul>
                </div>)}
            </div>
        </div>
    );
};

export default SearchBar;