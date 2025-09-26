import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

// Custom hook for easier context consumption
export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])

    // Load favorites from local storage on initial render
    // JSON.parse to convert string back to array
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")

        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    // Update local storage whenever favorites change
    // JSON.stringify to convert array to string
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        // ... is spread operator to copy the previous array and add new movie
        setFavorites(prev => [...prev, movie])
    }

    // Remove movie by filtering out the one with matching id
    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    
    // some() checks if any movie in favorites matches the given id
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}