export function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <ul className="navbar-nav mr-auto">
                        <a className="navbar-brand" href="/" style={{color: 'rgba(255,255,255,.5)'}}>Plane Spotters</a>
                        <li className="nav-item active d-flex">
                            <a className="nav-link" style={{whiteSpace: 'nowrap'}} data-toggle="collapse" href="#collapseAirport" role="button" aria-expanded="false" aria-controls="collapseAirport">Search by Airports</a>
                            <div className="collapse" id="collapseAirport">
                                <form className="d-flex" id="airportSearchForm">
                                    <input type="text" id="airportInput" className="form-control mr-2" placeholder="Airport" />
                                    <button type="submit" className="btn btn-outline-primary mr-2" style={{whiteSpace: 'nowrap'}}>Search</button>
                                </form>
                            </div>
                        </li>
                        <li className="nav-item d-flex">
                            <a className="nav-link" style={{whiteSpace: 'nowrap'}} data-toggle="collapse" href="#collapseFlight" role="button" aria-expanded="false" aria-controls="collapseFlight">Search by Flights</a>
                            <div className="collapse" id="collapseFlight">
                                <form className="d-flex" id="flightSearchForm">
                                    <input type="text" id="flightNoInput" className="form-control mr-2" placeholder="Flight Number" />
                                    <button type="submit" className="btn btn-outline-primary" style={{whiteSpace: 'nowrap'}}>Search</button>
                                </form>
                            </div>
                        </li>
                    </ul>
                    <div style={{color: 'rgba(255,255,255,.5)', textAlign: 'center'}}>
                        <i className="fa-solid fa-eye"></i>
                        <p className="text-center m-0">viewCount</p>
                    </div>
                </div>
        </nav>
    );
}

export function InfoBar() {
    return (
        <nav className="navbar bg-dark navbar-dark justify-content-center p-0">
            <div className="container-fluid mb-2">
                <div className="row m-auto" style={{width: '100%', color: 'rgba(255,255,255,.5)'}}>
                    <div className="col-2"></div>    
                    <div className="col-4 my-auto">
                        <h1 className="text-center m-0">airport</h1>
                        <p className="text-center">country | iata / icao</p>
                    </div>
                    <div className="col-4 my-auto">
                        <div className="row">
                            <div className="col-4 my-auto">
                                <p className="text-center m-0">Departing Routes</p>
                                <h1 className="text-center">depRoutes</h1>
                            </div>
                            <div className="col-4 my-auto">
                                <p className="text-center m-0">Arriving Routes</p>
                                <h1 className="text-center">arrRoutes</h1>
                            </div>
                            <div className="col-4 my-auto">
                                <p className="text-center m-0">Number of Location</p>
                                <h1 className="text-center">photos.length</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 my-auto">
                    </div>
                </div>
            </div>
        </nav>
    )
}