
import { searchMovies, getMovieDetails, getPopularMovies } from './api.js';
import { IMAGE_BASE_URL } from './api.js';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from './favorites.js';

// ===== HARCODED GENRES (DOES NOT DEPEND ON API) =====
const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

// DOM Elements
const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('catalogSearchInput');
const searchBtn = document.getElementById('catalogSearchBtn');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');
const sortFilter = document.getElementById('sortFilter');
const resultsTitle = document.getElementById('resultsTitle');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// State
let currentMovies = [];
let allMovies = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('CinemaFinder Catalog loaded');

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Populate genres from hardcoded list
    populateGenres();

    // Populate year filter
    populateYearFilter();

    // Check URL for search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        searchInput.value = searchQuery;
        await performSearch(searchQuery);
    } else {
        await loadPopularMovies();
    }

    // Setup event listeners
    setupEventListeners();
});

// Populate genre filter with hardcoded genres
function populateGenres() {
    genreFilter.innerHTML = '<option value="all">All Genres</option>';

    GENRES.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });

    console.log('Genres populated:', GENRES.length);
}

// Populate year filter (last 20 years)
function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    yearFilter.innerHTML = '<option value="all">All Years</option>';

    for (let year = currentYear; year >= currentYear - 20; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Load popular movies (default view)
async function loadPopularMovies() {
    try {
        resultsTitle.textContent = 'Popular Movies';
        catalogGrid.innerHTML = '<div class="loading-spinner"></div>';

        const movies = await getPopularMovies();
        allMovies = movies;
        currentMovies = [...movies];
        displayMovies();
    } catch (error) {
        console.error('Error loading popular movies:', error);
        catalogGrid.innerHTML = '<p class="error-message">Failed to load movies. Please try again later.</p>';
    }
}

// Perform search
async function performSearch(query) {
    if (!query.trim()) {
        await loadPopularMovies();
        return;
    }

    try {
        resultsTitle.textContent = `Search Results: "${query}"`;
        catalogGrid.innerHTML = '<div class="loading-spinner"></div>';

        const movies = await searchMovies(query);
        allMovies = movies;
        currentMovies = [...movies];
        displayMovies();
    } catch (error) {
        console.error('Error searching movies:', error);
        catalogGrid.innerHTML = '<p class="error-message">Search failed. Please try again.</p>';
    }
}

// Display movies with filters
function displayMovies() {
    if (!allMovies || allMovies.length === 0) {
        catalogGrid.innerHTML = '<p class="no-results">No movies found. Try a different search.</p>';
        return;
    }

    // Start with all movies from current search/popular
    let filtered = [...allMovies];

    // Apply genre filter
    if (genreFilter.value !== 'all') {
        const genreId = parseInt(genreFilter.value);
        filtered = filtered.filter(movie =>
            movie.genre_ids && movie.genre_ids.includes(genreId)
        );
    }

    // Apply year filter
    if (yearFilter.value !== 'all') {
        filtered = filtered.filter(movie =>
            movie.release_date && movie.release_date.split('-')[0] === yearFilter.value
        );
    }

    // Apply rating filter
    if (ratingFilter.value !== 'all') {
        const minRating = parseFloat(ratingFilter.value);
        filtered = filtered.filter(movie =>
            movie.vote_average >= minRating
        );
    }

    // Update current movies
    currentMovies = filtered;

    // Apply sorting
    applySorting();

    // Render movies
    renderMovies();
}

// Apply sorting
function applySorting() {
    const sortValue = sortFilter.value;

    switch (sortValue) {
        case 'popularity.desc':
            currentMovies.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'vote_average.desc':
            currentMovies.sort((a, b) => b.vote_average - a.vote_average);
            break;
        case 'release_date.desc':
            currentMovies.sort((a, b) => {
                const dateA = a.release_date || '1900-01-01';
                const dateB = b.release_date || '1900-01-01';
                return dateB.localeCompare(dateA);
            });
            break;
        case 'title.asc':
            currentMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
}

// Render movie cards
function renderMovies() {
    if (currentMovies.length === 0) {
        catalogGrid.innerHTML = '<p class="no-results">No movies match your filters.</p>';
        return;
    }

    catalogGrid.innerHTML = currentMovies.map(movie => {
        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'images/no-poster.jpg';

        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '?';
        const isFav = isFavorite(movie.id);

        return `
            <div class="movie-card" data-id="${movie.id}">
                <button class="favorite-btn ${isFav ? 'active' : ''}" aria-label="Add to favorites">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <img src="${posterPath}" 
                     alt="${movie.title} poster" 
                     class="movie-poster" 
                     loading="lazy"
                     onerror="this.src='images/no-poster.jpg'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-year">${year}</p>
                    <div class="movie-rating">
                        <span>⭐</span>
                        <span>${rating}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach event listeners to cards
    attachCardEvents();
}

// Attach events to movie cards
function attachCardEvents() {
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = parseInt(card.dataset.id);

        // Favorite button click
        const favBtn = card.querySelector('.favorite-btn');
        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(movieId, favBtn);
            });
        }

        // Card click for modal
        card.addEventListener('click', async (e) => {
            if (!e.target.closest('.favorite-btn')) {
                await showMovieModal(movieId);
            }
        });
    });
}

// Toggle favorite status
function toggleFavorite(movieId, button) {
    if (isFavorite(movieId)) {
        removeFavorite(movieId);
        button.classList.remove('active');
        button.textContent = '🤍';
    } else {
        const movie = allMovies.find(m => m.id === movieId) ||
            currentMovies.find(m => m.id === movieId);
        if (movie) {
            addFavorite(movie);
            button.classList.add('active');
            button.textContent = '❤️';
        }
    }
}

// Show movie details modal
async function showMovieModal(movieId) {
    try {
        const movie = await getMovieDetails(movieId);
        if (!movie) return;

        const modal = document.createElement('dialog');
        modal.className = 'movie-modal';

        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'images/no-poster.jpg';

        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Close modal">×</button>
                <div class="modal-grid">
                    <img src="${posterPath}" alt="${movie.title}" class="modal-poster">
                    <div class="modal-details">
                        <h2>${movie.title}</h2>
                        <p class="modal-year">${movie.release_date?.split('-')[0] || 'N/A'}</p>
                        <p class="modal-rating">⭐ ${movie.vote_average?.toFixed(1) || '?'}/10</p>
                        <p class="modal-overview">${movie.overview || 'No description available.'}</p>
                        <p class="modal-genres">
                            <strong>Genres:</strong> 
                            ${movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                        </p>
                        <p class="modal-runtime">
                            <strong>Runtime:</strong> 
                            ${movie.runtime ? `${movie.runtime} min` : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.showModal();

        // Close modal events
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.close();
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
                modal.remove();
            }
        });

    } catch (error) {
        console.error('Error showing movie modal:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search button
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        performSearch(query);
    });

    // Search input (Enter key)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            performSearch(query);
        }
    });

    // Filter change events - auto update
    genreFilter.addEventListener('change', () => displayMovies());
    yearFilter.addEventListener('change', () => displayMovies());
    ratingFilter.addEventListener('change', () => displayMovies());
    sortFilter.addEventListener('change', () => displayMovies());

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        genreFilter.value = 'all';
        yearFilter.value = 'all';
        ratingFilter.value = 'all';
        sortFilter.value = 'popularity.desc';
        displayMovies();
    });

    // Hamburger menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            hamburgerBtn.setAttribute('aria-expanded', expanded);
        });
    }
}