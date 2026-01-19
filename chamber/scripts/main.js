

document.addEventListener('DOMContentLoaded', function () {
    // Update copyright year and last modified date
    updateDates();

    // Initialize mobile navigation
    initMobileNavigation();

    // Set active navigation link
    setActiveNavLink();

    // ===== HOME PAGE SPECIFIC FUNCTIONS =====
    // Check if we're on the home page
    if (isHomePage()) {
        initializeHomePage();
    }

    // Initialize meeting banner (works on all pages)
    initMeetingBanner();

    // Update current date in header (if element exists)
    updateCurrentDate();
});

// Function to check if current page is home page
function isHomePage() {
    const currentPage = window.location.pathname;
    return (
        currentPage.endsWith('/') ||
        currentPage.endsWith('index.html') ||
        currentPage.endsWith('/chamber/') ||
        currentPage.includes('index')
    );
}

// ===== HOME PAGE INITIALIZATION =====
function initializeHomePage() {
    console.log('Initializing home page functionality...');

    // Display current date in header
    updateCurrentDate();

    // Set up lazy loading for images
    setupLazyLoading();

    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();

    // Initialize weather display if elements exist
    if (document.getElementById('weatherSection')) {
        console.log('Weather section found, initializing...');
        // Weather will be handled by weather.js module
    }

    // Initialize spotlights if elements exist
    if (document.getElementById('spotlightsContainer')) {
        console.log('Spotlights container found, loading members...');
        // Spotlights will be handled by spotlights.js module
    }
}

// ===== CURRENT DATE DISPLAY (for header) =====
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ===== MEETING BANNER =====
function initMeetingBanner() {
    const banner = document.getElementById('meetingBanner');
    const closeBtn = document.getElementById('closeBanner');

    if (!banner) return;

    // Check if today is Monday, Tuesday, or Wednesday
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Show on Monday (1), Tuesday (2), Wednesday (3)
    const shouldShow = dayOfWeek >= 1 && dayOfWeek <= 3;

    // Check if user has closed the banner today
    const bannerClosed = localStorage.getItem('bannerClosed');
    const todayDate = today.toDateString();

    if (shouldShow && bannerClosed !== todayDate) {
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }

    // Setup close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            banner.style.display = 'none';
            localStorage.setItem('bannerClosed', todayDate);
        });
    }
}

// ===== LAZY LOADING FOR IMAGES =====
function setupLazyLoading() {

    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// Function to update dates in footer
function updateDates() {
    // Current year
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Last modified date (use current date/time)
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        lastModifiedElement.textContent = 'Last Modification: ' + now.toLocaleDateString('es-ES', options);
    }
}

// Function to initialize mobile navigation
function initMobileNavigation() {
    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!menuButton.contains(event.target) && !mainNav.contains(event.target)) {
                mainNav.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                mainNav.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Function to set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('#main-nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Remove active class from all links
        link.classList.remove('active');

        // Check if current page matches link
        if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        }

        // Special case for index.html
        if (currentPage.endsWith('/') || currentPage.endsWith('index.html') || currentPage.endsWith('/chamber/')) {
            if (linkPath === 'index.html') {
                link.classList.add('active');
            }
        }
    });
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// ===== WEATHER UTILITY FUNCTIONS =====
function formatTemperature(temp) {
    return `${Math.round(temp)}°F`;
}

function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ===== EVENT HANDLERS FOR HOME PAGE =====
function setupEventListeners() {
    // CTA button hover effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Event card click handlers
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', function () {
            const link = this.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });
}

// ===== HELPER FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDates,
        initMobileNavigation,
        setActiveNavLink,
        formatPhoneNumber,
        isHomePage,
        initializeHomePage,
        updateCurrentDate,
        initMeetingBanner,
        formatTemperature,
        getWeatherIconUrl
    };
}