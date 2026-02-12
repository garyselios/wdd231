
import { getPopularMovies, getTrendingMovies, getMovieDetails } from './api.js';
import { IMAGE_BASE_URL } from './api.js';

// DOM Elements
const popularGrid = document.getElementById('popularGrid');
const trendingGrid = document.getElementById('trendingGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('CinemaFinder Home loaded');

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Load movies
    await loadPopularMovies();
    await loadTrendingMovies();

    // Setup event listeners
    setupEventListeners();
});

// Load popular movies
async function loadPopularMovies() {
    try {
        const movies = await getPopularMovies();
        displayMovies(movies, popularGrid);
    } catch (error) {
        console.error('Error loading popular movies:', error);
        popularGrid.innerHTML = '<p class="error-message">Failed to load movies. Please try again later.</p>';
    }
}

// Load trending movies
async function loadTrendingMovies() {
    try {
        const movies = await getTrendingMovies();
        displayMovies(movies, trendingGrid);
    } catch (error) {
        console.error('Error loading trending movies:', error);
        trendingGrid.innerHTML = '<p class="error-message">Failed to load movies. Please try again later.</p>';
    }
}

// Display movies in grid
function displayMovies(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found.</p>';
        return;
    }

    container.innerHTML = movies.map(movie => createMovieCard(movie)).join('');

    // Add click event to each card
    container.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => showMovieModal(movie.id));
    });
}

// Create movie card HTML using template literal
function createMovieCard(movie) {
    const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'images/no-poster.jpg';

    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '?';

    return `
        <div class="movie-card" data-id="${movie.id}">
            <img src="${posterPath}" 
                 alt="${movie.title} poster" 
                 class="movie-poster"
                 loading="lazy">
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
}

// Show movie details modal
async function showMovieModal(movieId) {
    const movie = await getMovieDetails(movieId);
    if (!movie) return;

    // Create modal
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
}

// Setup event listeners
function setupEventListeners() {
    // Search button
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
    });

    // Search input (Enter key)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
            }
        }
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