import MovieCard from "../components/MovieCard";
import MovieSkeleton from "../components/MovieSkeleton";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies, getGenres } from "../services/api";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // Fetch popular movies
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
                
                // Fetch genres list
                const genreList = await getGenres();
                setGenres(genreList || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load movies or genres...");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;

        setLoading(true);
        setSelectedGenreId(null); // Reset genre filter on new search
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.error(err)
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = async () => {
        setSearchQuery("");
        setLoading(true);
        setSelectedGenreId(null);
        try {
            const popularMovies = await getPopularMovies();
            setMovies(popularMovies);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to reload popular movies...");
        } finally {
            setLoading(false);
        }
    };

    // Filter movies based on selected genre
    const displayedMovies = selectedGenreId
        ? movies.filter((movie) => movie.genre_ids?.includes(selectedGenreId))
        : movies;

    return (
        <div className="home">
            <div className="home-header">
                <h1>Find Your Next Story</h1>
                <p>Discover popular movies, search for your favorites, and customize your ratings & notes.</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            type="button" 
                            className="search-clear-btn" 
                            onClick={handleClearSearch}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button type="submit" className="search-button" disabled={loading}>
                    Search
                </button>
            </form>

            {/* Genres bar */}
            {!loading && genres.length > 0 && (
                <div className="genres-bar">
                    <button
                        className={`genre-pill ${selectedGenreId === null ? "active" : ""}`}
                        onClick={() => setSelectedGenreId(null)}
                    >
                        All Genres
                    </button>
                    {genres.map((g) => {
                        // Only show genres that actually exist in the current movie results
                        const count = movies.filter(m => m.genre_ids?.includes(g.id)).length;
                        if (count === 0) return null;
                        
                        return (
                            <button
                                key={g.id}
                                className={`genre-pill ${selectedGenreId === g.id ? "active" : ""}`}
                                onClick={() => setSelectedGenreId(g.id)}
                            >
                                {g.name} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <MovieSkeleton count={8} />
            ) : (
                <>
                    {displayedMovies.length === 0 ? (
                        <div className="empty-results">
                            No movies found matching your search or genre filter.
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {displayedMovies.map((movie) => (
                                <MovieCard 
                                    movie={movie} 
                                    key={movie.id} 
                                    onCardClick={(id) => setSelectedMovieId(id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {selectedMovieId && (
                <MovieDetailsModal 
                    movieId={selectedMovieId} 
                    onClose={() => setSelectedMovieId(null)} 
                />
            )}
        </div>
    );
}

export default Home;
