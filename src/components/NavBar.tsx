import SearchBar from "./SearchBar";

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src="/planespotter_logo.svg"></img>
                <h1><a href="#home">Plane Spotter</a></h1>
            </div>
            {/* <div className="hamburger">
            </div> */}
            <SearchBar />
        </nav>
    );
}

export default NavBar;