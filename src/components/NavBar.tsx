import SearchBar from "./SearchBar";

export function NavBar() {
    return (
        <nav className="navbar">
            <div className="logo">
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 357.7 365.62"><polygon points="132.97 142.47 178.85 225.54 222.86 145.87 222.86 69.6 342.86 69.6 342.86 .03 13.86 .03 13.86 69.6 132.97 69.6 132.97 142.47"/><polygon points="273.19 84.75 178.85 255.54 84.52 84.75 14 84.75 14 351.17 80.78 351.17 80.78 237.66 140.51 351.65 214.86 351.65 273.65 237.66 273.65 351.17 343.7 351.17 343.7 84.75 273.19 84.75"/></svg> */}
                <img src="/planespotter_logo.svg"></img>
                <h1><a href="#home">Plane Spotter</a></h1>
            </div>
            <div className="hamburger">
            </div>
            <SearchBar />
            {/* <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#project">Project</a></li>
                <li><a href="#education">Education</a></li>
            </ul> */}
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