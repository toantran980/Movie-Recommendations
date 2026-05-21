import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({ movie, onCardClick }) {
    // The {} syntax is called destructuring assignment
    // extract values from an object and assign them to variables
    const { isFavorite, addToFavorites, removeFromFavorites, favorites } = useMovieContext()
    const favorite = isFavorite(movie.id)

    // Check if there is a personal rating from favorites
    const favItem = favorites.find(f => f.id === movie.id)
    const personalRating = favItem?.rating || 0

    // Prevent the default action and stop propagation to avoid opening details modal
    function onFavoriteClick(e) {
        e.preventDefault()
        e.stopPropagation()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return (
        <div className="movie-card" onClick={() => onCardClick && onCardClick(movie.id)}>
            {personalRating > 0 && (
                <div className="user-personal-rating">
                    ★ {personalRating}
                </div>
            )}
            <div className="movie-poster">
                <img 
                    src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : 'https://via.placeholder.com/500x750?text=No+Poster'
                    } 
                    alt={movie.title}
                />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                        ♥
                    </button>
                    <span className="overlay-details-btn">View Details</span>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta-row">
                    <span className="movie-release-year">{movie.release_date?.split("-")[0] || 'N/A'}</span>
                    <span className="movie-rating-badge">★ {movie.vote_average?.toFixed(1) || '0.0'}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard