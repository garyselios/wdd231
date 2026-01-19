
// banner.js - Meeting banner logic

const BANNER = document.getElementById('meetingBanner');
const CLOSE_BTN = document.getElementById('closeBanner');

// Check if today is Monday, Tuesday, or Wednesday
function shouldShowBanner() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Show on Monday (1), Tuesday (2), Wednesday (3)
    return dayOfWeek >= 1 && dayOfWeek <= 3;
}

// Initialize banner
function initBanner() {
    if (!BANNER) return;

    const bannerClosed = localStorage.getItem('bannerClosed');
    const today = new Date().toDateString();

    // Show banner if:
    // 1. It's Monday-Wednesday
    // 2. User hasn't closed it today
    if (shouldShowBanner() && bannerClosed !== today) {
        BANNER.style.display = 'block';
    } else {
        BANNER.style.display = 'none';
    }

    // Setup close button
    if (CLOSE_BTN) {
        CLOSE_BTN.addEventListener('click', () => {
            BANNER.style.display = 'none';
            // Store closure with today's date
            localStorage.setItem('bannerClosed', new Date().toDateString());
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initBanner);

// Export for module use
export { initBanner };