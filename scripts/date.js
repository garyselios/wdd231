// Dynamic date functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get current year
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Get last modified date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = document.lastModified;
        lastModifiedElement.textContent = 'Last Modification: ' + lastModified;
    }
});