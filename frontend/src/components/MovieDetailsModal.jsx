import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieDetailsModal.css";

function MovieDetailsModal({ movieId, onClose }) {
    const { 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        updateFavoriteRating, 
        updateFavoriteNotes,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isWatchlisted
    } = useMovieContext();

    const [activeMovieId, setActiveMovieId] = useState(movieId);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Find if the movie is already in favorites, to get its local notes/rating
    const favoriteItem = favorites.find(f => f.id === activeMovieId);
    const isFav = !!favoriteItem;
    const isWatch = isWatchlisted(activeMovieId);
    
    const [userRating, setUserRating] = useState(0);
    const [userNotes, setUserNotes] = useState("");
    const [saveStatus, setSaveStatus] = useState("");

    // Sync rating and notes from favoriteItem when modal loads or activeMovieId changes
    useEffect(() => {
        if (favoriteItem) {
            setUserRating(favoriteItem.rating || 0);
            setUserNotes(favoriteItem.notes || "");
        } else {
            setUserRating(0);
            setUserNotes("");
        }
    }, [favoriteItem, activeMovieId]);

    // Keep activeMovieId in sync with prop changes
    useEffect(() => {
        setActiveMovieId(movieId);
    }, [movieId]);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await getMovieDetails(activeMovieId);
                setMovie(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        if (activeMovieId) {
            fetchDetails();
        }
    }, [activeMovieId]);

    // Handle closing when clicking background
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!movieId) return null;

    const handleFavoriteToggle = () => {
        if (isFav) {
            removeFromFavorites(activeMovieId);
        } else {
            addToFavorites({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                rating: 0,
                notes: ""
            });
        }
    };

    const handleWatchlistToggle = () => {
        if (isWatch) {
            removeFromWatchlist(activeMovieId);
        } else {
            addToWatchlist({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            });
        }
    };

    const handleStarClick = (ratingValue) => {
        if (!isFav) {
            // Proactively add to favorites if they click star
            addToFavorites({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                rating: ratingValue,
                notes: ""
            });
        } else {
            updateFavoriteRating(activeMovieId, ratingValue);
        }
        setUserRating(ratingValue);
        showSaveIndicator();
    };

    const handleNotesChange = (e) => {
        const text = e.target.value;
        setUserNotes(text);
        if (isFav) {
            updateFavoriteNotes(activeMovieId, text);
            showSaveIndicator();
        }
    };

    const showSaveIndicator = () => {
        setSaveStatus("Saving...");
        setTimeout(() => {
            setSaveStatus("All changes saved locally");
        }, 600);
    };

    const formatRuntime = (minutes) => {
        if (!minutes) return "";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    const handleRecommendationClick = (recId) => {
        setActiveMovieId(recId);
        const container = document.querySelector(".modal-container");
        if (container) {
            container.scrollTop = 0;
        }
    };

    const scrollToTrailer = () => {
        const trailerSection = document.getElementById("trailer-section");
        if (trailerSection) {
            trailerSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Find official trailer video
    const trailer = movie?.videos?.results?.find(
        vid => vid.type === "Trailer" && vid.site === "YouTube"
    ) || movie?.videos?.results?.[0];

    // Top cast members (max 6)
    const cast = movie?.credits?.cast?.slice(0, 6) || [];

    // Recommended movies
    const recommendations = movie?.recommendations?.results?.slice(0, 6) || [];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <button className="modal-close-btn" onClick={onClose} aria-label="Close details">✕</button>
                
                {loading && (
                    <div style={{ padding: "4rem", textAlign: "center" }}>
                        <div className="loading" style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Loading details...</div>
                    </div>
                )}

                {error && (
                    <div style={{ padding: "4rem", textAlign: "center" }}>
                        <div className="error-message">{error}</div>
                    </div>
                )}

                {!loading && !error && movie && (
                    <>
                        <div 
                            className="modal-backdrop-hero" 
                            style={{ 
                                backgroundImage: movie.backdrop_path 
                                    ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` 
                                    : 'none',
                                backgroundColor: 'var(--bg-tertiary)'
                            }}
                        />
                        
                        <div className="modal-content-layout">
                            <div className="modal-poster-wrapper">
                                <img 
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                                        : 'https://via.placeholder.com/500x750?text=No+Poster'
                                    } 
                                    alt={movie.title} 
                                />
                            </div>
                            
                            <div className="modal-details">
                                <div className="modal-header-info">
                                    <h2>{movie.title}</h2>
                                    <div className="modal-meta-row">
                                        <span className="rating-badge">
                                            ★ {movie.vote_average?.toFixed(1) || '0.0'}
                                        </span>
                                        {movie.release_date && (
                                            <span className="meta-pill">
                                                {movie.release_date.split("-")[0]}
                                            </span>
                                        )}
                                        {movie.runtime > 0 && (
                                            <span className="meta-pill">
                                                {formatRuntime(movie.runtime)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        className={`action-btn fav ${isFav ? "active" : ""}`}
                                        onClick={handleFavoriteToggle}
                                    >
                                        ♥ {isFav ? "Favorited" : "Add to Favorites"}
                                    </button>
                                    <button 
                                        className={`action-btn fav ${isWatch ? "active" : ""}`}
                                        onClick={handleWatchlistToggle}
                                        style={{ color: isWatch ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                    >
                                        📌 {isWatch ? "In Watchlist" : "Add to Watchlist"}
                                    </button>
                                    {trailer && (
                                        <button 
                                            onClick={scrollToTrailer}
                                            className="action-btn trailer"
                                        >
                                            ▶ Watch Trailer
                                        </button>
                                    )}
                                </div>
                                
                                {movie.genres && movie.genres.length > 0 && (
                                    <div className="modal-genres">
                                        {movie.genres.map(g => (
                                            <span key={g.id} className="genre-tag">{g.name}</span>
                                        ))}
                                    </div>
                                )}
                                
                                {movie.overview && (
                                    <div className="detail-section">
                                        <h4>Synopsis</h4>
                                        <p>{movie.overview}</p>
                                    </div>
                                )}
                                
                                {cast.length > 0 && (
                                    <div className="detail-section">
                                        <h4>Top Billed Cast</h4>
                                        <div className="cast-list">
                                            {cast.map(c => (
                                                <div className="cast-member" key={c.id}>
                                                    <div className="cast-avatar">
                                                        <img 
                                                            src={c.profile_path 
                                                                ? `https://image.tmdb.org/t/p/w185${c.profile_path}` 
                                                                : 'https://via.placeholder.com/100x100?text=Cast'
                                                            } 
                                                            alt={c.name} 
                                                        />
                                                    </div>
                                                    <span className="cast-name">{c.name}</span>
                                                    <span className="cast-role">{c.character}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {trailer && (
                                    <div className="detail-section" id="trailer-section">
                                        <h4>Official Trailer</h4>
                                        <div className="trailer-embed-container">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                                title={`${movie.title} Official Trailer`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="trailer-iframe"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {recommendations.length > 0 && (
                                    <div className="detail-section">
                                        <h4>Recommendations</h4>
                                        <div className="recommendations-list">
                                            {recommendations.map(rec => (
                                                <div 
                                                    className="recommendation-item" 
                                                    key={rec.id}
                                                    onClick={() => handleRecommendationClick(rec.id)}
                                                    title={rec.title}
                                                >
                                                    <div className="recommendation-poster">
                                                        <img 
                                                            src={rec.poster_path 
                                                                ? `https://image.tmdb.org/t/p/w185${rec.poster_path}` 
                                                                : 'https://via.placeholder.com/92x138?text=No+Poster'
                                                            } 
                                                            alt={rec.title} 
                                                        />
                                                        <div className="recommendation-overlay">
                                                            <span>★ {rec.vote_average?.toFixed(1) || '0.0'}</span>
                                                        </div>
                                                    </div>
                                                    <span className="recommendation-title">{rec.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="user-rating-notes-box">
                                    <div className="user-stars-row">
                                        <span>Your Rating:</span>
                                        <div className="stars-interactive">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-interactive-btn ${star <= userRating ? "active" : ""}`}
                                                    onClick={() => handleStarClick(star)}
                                                    title={`Rate ${star} Stars`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        {userRating > 0 && !isFav && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                                                (Added to Favorites)
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="user-notes-field">
                                        <textarea
                                            placeholder={isFav ? "Add personal notes about this movie..." : "Add to favorites to write notes..."}
                                            value={userNotes}
                                            onChange={handleNotesChange}
                                            disabled={!isFav}
                                        />
                                        {saveStatus && (
                                            <span className="notes-save-indicator">{saveStatus}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MovieDetailsModal;
