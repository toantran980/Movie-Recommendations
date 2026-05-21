import {createContext, useState, useContext, useEffect, useRef} from "react"

const MovieContext = createContext()

// Custom hook for easier context consumption
export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])
    const [watchlist, setWatchlist] = useState([])
    const [toast, setToast] = useState(null)
    const toastTimeoutRef = useRef(null)

    // Load favorites and watchlist from local storage on initial render
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")
        if (storedFavs) setFavorites(JSON.parse(storedFavs))

        const storedWatchlist = localStorage.getItem("watchlist")
        if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist))
    }, [])

    // Update local storage whenever favorites change
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    // Update local storage whenever watchlist changes
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }, [watchlist])

    const showToast = (message, type = "info") => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current)
        }
        setToast({ message, type })
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null)
        }, 3000)
    }

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, { ...movie, rating: movie.rating || 0, notes: movie.notes || "" }])
        showToast(`"${movie.title}" added to Favorites`, "success")
    }

    const removeFromFavorites = (movieId) => {
        const movie = favorites.find(m => m.id === movieId)
        setFavorites(prev => prev.filter(m => m.id !== movieId))
        if (movie) {
            showToast(`"${movie.title}" removed from Favorites`, "info")
        }
    }
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const updateFavoriteRating = (movieId, rating) => {
        setFavorites(prev => prev.map(movie => 
            movie.id === movieId ? { ...movie, rating } : movie
        ))
    }

    const updateFavoriteNotes = (movieId, notes) => {
        setFavorites(prev => prev.map(movie => 
            movie.id === movieId ? { ...movie, notes } : movie
        ))
    }

    const addToWatchlist = (movie) => {
        setWatchlist(prev => [...prev, movie])
        showToast(`"${movie.title}" added to Watchlist`, "success")
    }

    const removeFromWatchlist = (movieId) => {
        const movie = watchlist.find(m => m.id === movieId)
        setWatchlist(prev => prev.filter(m => m.id !== movieId))
        if (movie) {
            showToast(`"${movie.title}" removed from Watchlist`, "info")
        }
    }

    const isWatchlisted = (movieId) => {
        return watchlist.some(m => m.id === movieId)
    }

    const value = {
        favorites,
        watchlist,
        toast,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        updateFavoriteRating,
        updateFavoriteNotes,
        addToWatchlist,
        removeFromWatchlist,
        isWatchlisted,
        showToast
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}