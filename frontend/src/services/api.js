
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movies/popular`);
    const data = await response.json();
    return data;
};

export const searchMovies = async (query) => {
    const response = await fetch(
        `${BASE_URL}/movies/search?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data;
};

export const searchMoviesPage = async (query, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
};

export const getTrendingMovies = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movies/trending?page=${page}`);
    const data = await response.json();
    return data;
};

export const getTopRatedMovies = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movies/top-rated?page=${page}`);
    const data = await response.json();
    return data;
};

export const getUpcomingMovies = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movies/upcoming?page=${page}`);
    const data = await response.json();
    return data;
};

export const discoverMovies = async ({ page = 1, genre, year, sortBy } = {}) => {
    const query = new URLSearchParams({ page, sort_by: sortBy || 'popularity.desc' });
    if (genre) query.set('genre', genre);
    if (year) query.set('year', year);
    const response = await fetch(`${BASE_URL}/movies/discover?${query}`);
    const data = await response.json();
    return data;
};

export const getGenres = async () => {
    const response = await fetch(`${BASE_URL}/movies/genres`);
    const data = await response.json();
    return data;
};

export const getMovieDetails = async (id) => {
    const response = await fetch(`${BASE_URL}/movies/${id}`);
    const data = await response.json();
    return data;
};

export const authRegister = async ({ email, password }) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const authLogin = async ({ email, password }) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const authLogout = async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    return response.json();
};

export const getCurrentUser = async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
    });
    return response.json();
};

export const getUserList = async (type) => {
    const response = await fetch(`${BASE_URL}/lists${type ? `?type=${type}` : ''}`, {
        credentials: 'include',
    });
    return response.json();
};

export const addListItem = async (item) => {
    const response = await fetch(`${BASE_URL}/lists`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    return response.json();
};

export const updateListItem = async (id, updates) => {
    const response = await fetch(`${BASE_URL}/lists/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    return response.json();
};

export const removeListItem = async (id) => {
    const response = await fetch(`${BASE_URL}/lists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return response.json();
};
