// scripts/api.js
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDIxY2Y0OTBhOTNjNDZmNjMwM2RlZDkzNjM1YWM5NSIsIm5iZiI6MTc3MDgzODg4NC43MTYsInN1YiI6IjY5OGNkYjY0MTAzODM4ZDYzMDgyYWMzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kKhsa3ueMQy2oOV6vRlMDqWM-iGSSjoNbBap3_8hLzM';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Headers with Bearer authentication
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`
    }
};

// Fetch popular movies
export async function getPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.results.slice(0, 15);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
}

// Fetch trending movies
export async function getTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?language=en-US`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.results.slice(0, 15);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

// Search movies
export async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

// Fetch movie details
export async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?language=en-US`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

// Fetch movie genres
export async function getGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?language=en`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}