import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { getUserList, addListItem, removeListItem, updateListItem } from '../services/api';

const MovieContext = createContext();

// Custom hook for easier context consumption
export const useMovieContext = () => useContext(MovieContext);

const transformServerItem = (item) => ({
    ...item,
    id: item.movieId,
    movieId: item.movieId,
});

export const MovieProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    useEffect(() => {
        const loadLocalLists = () => {
            const storedFavs = localStorage.getItem('favorites');
            if (storedFavs) setFavorites(JSON.parse(storedFavs));

            const storedWatchlist = localStorage.getItem('watchlist');
            if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
        };

        const loadRemoteLists = async () => {
            try {
                const [favData, watchData] = await Promise.all([
                    getUserList('favorite'),
                    getUserList('watchlist'),
                ]);
                setFavorites((Array.isArray(favData) ? favData : []).map(transformServerItem));
                setWatchlist((Array.isArray(watchData) ? watchData : []).map(transformServerItem));
            } catch (err) {
                console.error('Unable to load saved lists:', err);
                loadLocalLists();
            }
        };

        if (user) {
            loadRemoteLists();
        } else {
            loadLocalLists();
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites, user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        }
    }, [watchlist, user]);

    const showToast = (message, type = 'info') => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const addToFavorites = async (movie) => {
        if (user) {
            try {
                const saved = await addListItem({
                    movieId: movie.id,
                    type: 'favorite',
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    rating: movie.rating || 0,
                    notes: movie.notes || '',
                });
                if (saved && saved._id) {
                    setFavorites((prev) => [...prev, transformServerItem(saved)]);
                    showToast(`"${movie.title}" added to Favorites`, 'success');
                }
            } catch (err) {
                console.error('Add favorite failed:', err);
                showToast('Unable to add favorite', 'error');
            }
        } else {
            setFavorites((prev) => [...prev, { ...movie, rating: movie.rating || 0, notes: movie.notes || '' }]);
            showToast(`"${movie.title}" added to Favorites`, 'success');
        }
    };

    const removeFromFavorites = async (movieId) => {
        const existing = favorites.find((movie) => movie.movieId === movieId || movie.id === movieId);
        if (user && existing?._id) {
            try {
                await removeListItem(existing._id);
            } catch (err) {
                console.error('Remove favorite failed:', err);
                showToast('Unable to remove favorite', 'error');
            }
        }

        setFavorites((prev) => prev.filter((movie) => (movie.movieId || movie.id) !== movieId));
        if (existing) {
            showToast(`"${existing.title}" removed from Favorites`, 'info');
        }
    };

    const isFavorite = (movieId) => {
        return favorites.some((movie) => (movie.movieId || movie.id) === movieId);
    };

    const updateFavoriteRating = async (movieId, rating) => {
        const existing = favorites.find((movie) => (movie.movieId || movie.id) === movieId);
        if (user && existing?._id) {
            try {
                await updateListItem(existing._id, { rating });
            } catch (err) {
                console.error('Update favorite rating failed:', err);
                showToast('Unable to update rating', 'error');
            }
        }
        setFavorites((prev) => prev.map((movie) =>
            (movie.movieId || movie.id) === movieId ? { ...movie, rating } : movie
        ));
    };

    const updateFavoriteNotes = async (movieId, notes) => {
        const existing = favorites.find((movie) => (movie.movieId || movie.id) === movieId);
        if (user && existing?._id) {
            try {
                await updateListItem(existing._id, { notes });
            } catch (err) {
                console.error('Update favorite notes failed:', err);
                showToast('Unable to update notes', 'error');
            }
        }
        setFavorites((prev) => prev.map((movie) =>
            (movie.movieId || movie.id) === movieId ? { ...movie, notes } : movie
        ));
    };

    const addToWatchlist = async (movie) => {
        if (user) {
            try {
                const saved = await addListItem({
                    movieId: movie.id,
                    type: 'watchlist',
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                });
                if (saved && saved._id) {
                    setWatchlist((prev) => [...prev, transformServerItem(saved)]);
                    showToast(`"${movie.title}" added to Watchlist`, 'success');
                }
            } catch (err) {
                console.error('Add watchlist failed:', err);
                showToast('Unable to add watchlist', 'error');
            }
        } else {
            setWatchlist((prev) => [...prev, movie]);
            showToast(`"${movie.title}" added to Watchlist`, 'success');
        }
    };

    const removeFromWatchlist = async (movieId) => {
        const existing = watchlist.find((movie) => (movie.movieId || movie.id) === movieId);
        if (user && existing?._id) {
            try {
                await removeListItem(existing._id);
            } catch (err) {
                console.error('Remove watchlist failed:', err);
                showToast('Unable to remove watchlist item', 'error');
            }
        }

        setWatchlist((prev) => prev.filter((movie) => (movie.movieId || movie.id) !== movieId));
        if (existing) {
            showToast(`"${existing.title}" removed from Watchlist`, 'info');
        }
    };

    const isWatchlisted = (movieId) => {
        return watchlist.some((movie) => (movie.movieId || movie.id) === movieId);
    };

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
        showToast,
    };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};