// Simple JavaScript for the Site Plan document
document.addEventListener('DOMContentLoaded', function () {
    // Set current date in footer
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = currentDate;
    }

    // Add click event to color samples to show hex value
    const colorSamples = document.querySelectorAll('.color-sample');
    colorSamples.forEach(sample => {
        sample.addEventListener('click', function () {
            const colorBox = this.closest('.color-box');
            const colorName = colorBox.querySelector('strong').textContent;
            const colorHex = colorBox.querySelector('p:nth-child(3)').textContent;

            alert(`${colorName}\nHex: ${colorHex}`);
        });
    });

    // Log when page is loaded
    console.log('CinemaFinder Site Plan loaded successfully.');
    console.log('Project features:');
    console.log('- TMDB API Integration');
    console.log('- Movie Search & Discovery');
    console.log('- Local Storage for Favorites');
    console.log('- Responsive Design');
    console.log('- Dynamic Content Generation');
});