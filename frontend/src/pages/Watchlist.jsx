import "../css/Watchlist.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useState } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
    const { watchlist } = useMovieContext();
    const [sortBy, setSortBy] = useState("default");
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    if (!watchlist || watchlist.length === 0) {
        return (
            <div className="watchlist-empty">
                <span className="empty-icon" style={{ fontSize: '3.5rem' }}>📌</span>
                <h2>Your Watchlist is Empty</h2>
                <p>Bookmark movies you want to watch and they will show up here!</p>
                <Link to="/" className="browse-btn">Find Movies</Link>
            </div>
        );
    }

    // Sort watchlist copy
    const sortedWatchlist = [...watchlist].sort((a, b) => {
        if (sortBy === "title-asc") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "release-desc") {
            const yearA = a.release_date ? parseInt(a.release_date.split("-")[0]) : 0;
            const yearB = b.release_date ? parseInt(b.release_date.split("-")[0]) : 0;
            return yearB - yearA;
        }
        return 0; // default (added order)
    });

    return (
        <div className="watchlist">
            <div className="watchlist-header">
                <h2>My Watchlist</h2>
                <div className="watchlist-controls">
                    <label htmlFor="watchlist-sort-select">Sort By:</label>
                    <select 
                        id="watchlist-sort-select" 
                        className="sort-select" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Recently Added</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="release-desc">Release Year (Newest)</option>
                    </select>
                </div>
            </div>
            
            <div className="movies-grid">
                {sortedWatchlist.map((movie) => (
                    <MovieCard 
                        movie={movie} 
                        key={movie.id} 
                        onCardClick={(id) => setSelectedMovieId(id)}
                    />
                ))}
            </div>

            {selectedMovieId && (
                <MovieDetailsModal 
                    movieId={selectedMovieId} 
                    onClose={() => setSelectedMovieId(null)} 
                />
            )}
        </div>
    );
}

export default Watchlist;
