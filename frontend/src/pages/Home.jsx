import MovieCard from "../components/MovieCard";
import MovieSkeleton from "../components/MovieSkeleton";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useState, useEffect } from "react";
import {
    searchMovies,
    getPopularMovies,
    getGenres,
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from "../services/api";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [browseMode, setBrowseMode] = useState('popular');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const popular = await getPopularMovies();
                setMovies(popular);
                setPopularMovies(popular);

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

    useEffect(() => {
        if (!popularMovies.length) return;

        const interval = window.setInterval(() => {
            setHeroIndex((current) => (current + 1) % Math.min(popularMovies.length, 3));
        }, 7000);

        return () => window.clearInterval(interval);
    }, [popularMovies]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;

        setLoading(true);
        setSelectedGenreId(null);
        setBrowseMode('popular');
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
        setSelectedGenreId(null);
        setBrowseMode('popular');
        setLoading(true);
        try {
            const popular = await getPopularMovies();
            setMovies(popular);
            setPopularMovies(popular);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to reload popular movies...");
        } finally {
            setLoading(false);
        }
    };

    const handleBrowseModeChange = async (mode) => {
        if (loading) return;
        setBrowseMode(mode);
        setSelectedGenreId(null);
        setSearchQuery("");
    };

    useEffect(() => {
        if (searchQuery.trim()) return;

        const loadBrowseMovies = async () => {
            setLoading(true);
            try {
                let moviesData = [];
                if (browseMode === 'trending') {
                    moviesData = await getTrendingMovies();
                } else if (browseMode === 'top-rated') {
                    moviesData = await getTopRatedMovies();
                } else if (browseMode === 'upcoming') {
                    moviesData = await getUpcomingMovies();
                } else {
                    moviesData = await getPopularMovies();
                }

                setMovies(moviesData);
                if (browseMode === 'popular') {
                    setPopularMovies(moviesData);
                }
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load browse movies...');
            } finally {
                setLoading(false);
            }
        };

        loadBrowseMovies();
    }, [browseMode, searchQuery]);

    const scrollToBrowse = () => {
        const element = document.querySelector(".search-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const heroMovies = popularMovies.slice(0, 3);
    const heroMovie = heroMovies[heroIndex] || popularMovies[0] || movies[0];

    const changeHero = (direction) => {
        if (!heroMovies.length) return;
        setHeroIndex((current) => {
            const next = (current + direction + heroMovies.length) % heroMovies.length;
            return next;
        });
    };

    const displayedMovies = selectedGenreId
        ? movies.filter((movie) => movie.genre_ids?.includes(selectedGenreId))
        : movies;

    return (
        <div className="home">
            {heroMovie && (
                <section
                    className="hero-banner"
                    style={{
                        backgroundImage: heroMovie.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
                            : undefined,
                    }}
                >
                    <div className="hero-overlay" />
                    <div className="hero-content">
                        <span className="hero-eyebrow">Premium Picks</span>
                        <h1>{heroMovie.title}</h1>
                        <p>{heroMovie.overview || "Explore today's most talked-about movies and get inspired for your next watch."}</p>
                        <div className="hero-actions">
                            <button className="hero-cta" type="button" onClick={scrollToBrowse}>
                                Browse Movies
                            </button>
                            <button className="hero-secondary" type="button" onClick={() => changeHero(1)}>
                                Next Recommendation →
                            </button>
                        </div>
                        <div className="hero-stats">
                            <span>{heroMovie.release_date?.split("-")[0] || "––"}</span>
                            <span>•</span>
                            <span>{heroMovie.vote_average?.toFixed(1) || "0.0"} / 10</span>
                            <span>•</span>
                            <span>{heroMovie.genre_ids?.length || 0} genres</span>
                        </div>
                        <div className="hero-pagination">
                            {heroMovies.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={index === heroIndex ? "active" : ""}
                                    onClick={() => setHeroIndex(index)}
                                    aria-label={`Show ${item.title}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

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

            <div className="browse-tabs">
                {[
                    { key: 'popular', label: 'Popular' },
                    { key: 'trending', label: 'Trending' },
                    { key: 'top-rated', label: 'Top Rated' },
                    { key: 'upcoming', label: 'Upcoming' },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`browse-tab ${browseMode === tab.key ? 'active' : ''}`}
                        onClick={() => handleBrowseModeChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {!loading && genres.length > 0 && (
                <div className="genres-bar">
                    <button
                        className={`genre-pill ${selectedGenreId === null ? "active" : ""}`}
                        onClick={() => setSelectedGenreId(null)}
                    >
                        All Genres
                    </button>
                    {genres.map((g) => {
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
                            {displayedMovies.map((movie, index) => (
                                <MovieCard 
                                    movie={movie} 
                                    key={movie.id} 
                                    delay={index * 40}
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
