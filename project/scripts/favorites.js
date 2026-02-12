
const FAVORITES_KEY = 'cinemaFinderFavorites';

// Get favorites from localStorage
export function getFavorites() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

// Add movie to favorites
export function addFavorite(movie) {
    try {
        const favorites = getFavorites();

        // Check if already in favorites
        if (!favorites.some(fav => fav.id === movie.id)) {
            // Store only essential data
            const favoriteMovie = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            };

            favorites.push(favoriteMovie);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return false;
    }
}

// Remove movie from favorites
export function removeFavorite(movieId) {
    try {
        const favorites = getFavorites();
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
}

// Check if movie is in favorites
export function isFavorite(movieId) {
    try {
        const favorites = getFavorites();
        return favorites.some(movie => movie.id === movieId);
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
}

// Clear all favorites
export function clearFavorites() {
    try {
        localStorage.removeItem(FAVORITES_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing favorites:', error);
        return false;
    }
}