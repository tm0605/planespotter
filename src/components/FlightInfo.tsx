import { useContext } from "react";
import FlightContext from "../contexts/FlightContext";

export function FlightInfo() {
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
                <h3>Flight: {flight_icao} | {flight_iata}</h3>
                <p>{dep_icao} - {arr_icao}</p>
                <p>{dep_iata} - {arr_iata}</p>
                <p>Aircraft: {aircraft}</p>
                <p>Registration: {reg_number}</p>
                <p>Altitude: {alt.toFixed(0)} | {v_speed}</p>
                <p>Speed: {speed}</p>
                <p>Direction: {dir}</p>
                <p>Latitude: {lat} Longitude: {lng}</p>
                <p>Squawk: {squawk}</p>
            </div>
        )
    }
}