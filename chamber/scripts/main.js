

document.addEventListener('DOMContentLoaded', function () {
    // Update copyright year and last modified date
    updateDates();

    // Initialize mobile navigation
    initMobileNavigation();

    // Set active navigation link
    setActiveNavLink();
});

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

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDates,
        initMobileNavigation,
        setActiveNavLink,
        formatPhoneNumber
    };
}