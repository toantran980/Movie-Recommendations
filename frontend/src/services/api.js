
const BASE_URL = "http://localhost:5000/api";

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
