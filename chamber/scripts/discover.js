
let attractions = [];

// DOM Elements
const galleryContainer = document.getElementById('galleryContainer');
const visitMessage = document.getElementById('visitMessage');

// Function to load attractions from JSON
async function loadAttractions() {
    try {
        const response = await fetch('./data/attractions.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        attractions = await response.json();

        // Create cards after data is loaded
        createAttractionCards();

    } catch (error) {
        console.error('Error loading attractions data:', error);
        galleryContainer.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the attractions data. Please try again later.</p>
            </div>
        `;
    }
}

// Function to format date
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// Function to handle last visit message
function handleVisitMessage() {
    const LAST_VISIT_KEY = 'lastVisitDate';
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    const lastVisitTime = localStorage.getItem(LAST_VISIT_KEY);
    let message = '';

    if (!lastVisitTime) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitDate = new Date(parseInt(lastVisitTime));
        const timeDifference = currentTime - lastVisitDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            message = 'Back so soon! Awesome!';
        } else if (daysDifference === 1) {
            message = `You last visited ${daysDifference} day ago.`;
        } else {
            message = `You last visited ${daysDifference} days ago.`;
        }
    }

    visitMessage.innerHTML = `
        <p>${message}</p>
        <small>Current date: ${formatDate(currentDate)}</small>
    `;

    localStorage.setItem(LAST_VISIT_KEY, currentTime.toString());
}

// Function to create attraction cards
function createAttractionCards() {
    // Clear container first
    galleryContainer.innerHTML = '';

    attractions.forEach(attraction => {
        const card = document.createElement('article');
        card.className = 'attraction-card';

        card.innerHTML = `
            <figure class="attraction-figure">
                <picture>
                    <source srcset="${attraction.image}" type="image/webp">
                    <img src="${attraction.image.replace('.webp', '.jpg')}" 
                         alt="${attraction.name} - ${attraction.category}" 
                         class="attraction-image" 
                         width="300" 
                         height="200"
                         loading="lazy">
                </picture>
            </figure>
            <div class="attraction-content">
                <span class="attraction-category">${attraction.category}</span>
                <h2>${attraction.name}</h2>
                <address class="attraction-address">${attraction.address}</address>
                <p class="attraction-description">${attraction.description}</p>
                <button class="learn-more-btn" data-id="${attraction.id}">
                    Learn More
                </button>
            </div>
        `;

        galleryContainer.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.learn-more-btn').forEach(button => {
        button.addEventListener('click', function () {
            const attractionId = this.getAttribute('data-id');
            const attraction = attractions.find(a => a.id === parseInt(attractionId));

            alert(`More information about: ${attraction.name}\n\n${attraction.description}\n\nAddress: ${attraction.address}`);
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Update current date in header
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formatDate(new Date());
    }

    // Handle visit message
    handleVisitMessage();

    // Load attractions from JSON and create cards
    loadAttractions();

    // Handle hamburger menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
    }

    // Handle meeting banner
    const meetingBanner = document.getElementById('meetingBanner');
    const closeBanner = document.getElementById('closeBanner');

    if (meetingBanner && closeBanner) {
        const bannerClosed = localStorage.getItem('meetingBannerClosed');
        if (!bannerClosed) {
            meetingBanner.style.display = 'block';
        }

        closeBanner.addEventListener('click', () => {
            meetingBanner.style.display = 'none';
            localStorage.setItem('meetingBannerClosed', 'true');
        });
    }
});