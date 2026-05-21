import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useMovieContext } from '../contexts/MovieContext';
import { useAuthContext } from '../contexts/useAuthContext';
import '../css/Navbar.css';

function NavBar() {
    const { favorites, watchlist } = useMovieContext();
    const { user, logout } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" onClick={closeMenu}>Movie App</Link>
            </div>

            <button
                className={`nav-burger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
            >
                <span />
                <span />
                <span />
            </button>

            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/favorites"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    Favorites
                    <span className="nav-badge">{favorites.length}</span>
                </NavLink>
                <NavLink
                    to="/watchlist"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    Watchlist
                    <span className="nav-badge">{watchlist.length}</span>
                </NavLink>
                {user ? (
                    <button className="nav-link nav-button" onClick={() => { logout(); closeMenu(); }}>
                        Logout
                    </button>
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default NavBar;