
document.addEventListener('DOMContentLoaded', () => {
    console.log('CinemaFinder About page loaded');

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Setup form handler
    setupFormHandler();

    // Setup hamburger menu
    setupHamburgerMenu();
});

// Handle newsletter form submission
function setupFormHandler() {
    const form = document.getElementById('newsletterForm');
    const formResult = document.getElementById('formResult');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const formValues = {};

        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }

        // Display form data
        displayFormSubmission(formValues, formResult);

        // Reset form
        form.reset();
    });
}

// Display form submission data
function displayFormSubmission(data, resultContainer) {
    const fullName = data.fullName || 'Not provided';
    const email = data.email || 'Not provided';
    const country = data.country || 'Not selected';
    const interests = data.interests || 'Not selected';

    resultContainer.classList.add('show');
    resultContainer.innerHTML = `
        <h3>✅ Subscription Successful!</h3>
        <p>Thank you for subscribing to our newsletter, <strong>${fullName}</strong>!</p>
        <div class="submission-details">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Interests:</strong> ${interests}</p>
        </div>
        <p class="confirmation-note">You will receive our next newsletter in your inbox.</p>
    `;

    // Auto-hide after 10 seconds
    setTimeout(() => {
        resultContainer.classList.remove('show');
    }, 10000);
}

// Setup hamburger menu
function setupHamburgerMenu() {
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