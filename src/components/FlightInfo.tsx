import { useContext } from "react";
import FlightContext from "../contexts/FlightContext";

const FlightInfo = ()  => {
    const { selectedFlight } = useContext(FlightContext);

    if (selectedFlight != null) {
        const flight_icao = selectedFlight.flight_icao;
        const flight_iata = selectedFlight.flight_iata;
        const dep_icao = selectedFlight.dep_icao;
        const dep_iata = selectedFlight.dep_iata;
        const arr_icao = selectedFlight.arr_icao;
        const arr_iata = selectedFlight.arr_iata;
        const aircraft = selectedFlight.aircraft_icao;
        const reg_number = selectedFlight.reg_number;
        const alt = selectedFlight.alt * 3.281;
        const v_speed = selectedFlight.v_speed;
        const speed = selectedFlight.speed;
        const dir = selectedFlight.dir;
        const lat = selectedFlight.lat;
        const lng = selectedFlight.lng;
        const squawk = selectedFlight.squawk;

        return (
            <div className="sidebar">
                <img src="//cdn.jetphotos.com/400/6/79131_1435673287.jpg" alt="JA8985 - Boeing 777-246 - Japan Airlines (JAL)" title="Photo of JA8985 - Boeing 777-246 - Japan Airlines (JAL)" />
                <h2>{flight_icao != null && flight_icao} | {flight_iata != null && flight_iata}</h2>
                <h3>{dep_icao != null && dep_icao} - {arr_icao != null && arr_icao}</h3>
                <p>{dep_iata != null && dep_iata} - {arr_iata != null && arr_iata}</p>
                <p>Aircraft: {aircraft != null && aircraft}</p>
                <p>Registration: {reg_number != null && reg_number}</p>
                <p>Altitude: {alt != null && alt.toFixed(0)} | {v_speed != null && v_speed}</p>
                <p>Speed: {speed != null && speed}</p>
                <p>Direction: {dir != null && dir.toFixed(0)}</p>
                <p>Latitude: {lat != null && lat.toFixed(2)} Longitude: {lng != null && lng.toFixed(2)}</p>
                <p>Squawk: {squawk != null && squawk}</p>
            </div>
        )
    }
}

export default FlightInfo;