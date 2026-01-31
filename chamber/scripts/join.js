// Set current timestamp when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Set hidden timestamp field
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }

    // Initialize modals
    initModals();

    // Add animation classes to membership cards
    animateMembershipCards();
});

// Modal functionality
function initModals() {
    // Get all modal buttons and modals
    const modalButtons = document.querySelectorAll('.info-btn');
    const modals = document.querySelectorAll('.membership-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal when button is clicked
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.membership-modal');
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
            }
        });
    });
}

// Animate membership cards on page load
function animateMembershipCards() {
    const cards = document.querySelectorAll('.membership-card');

    cards.forEach((card, index) => {
        // Add delay for staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-in');
    });
}