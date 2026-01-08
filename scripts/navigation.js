// Navigation menu functionality
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    // Toggle mobile menu
    menuButton.addEventListener('click', function () {
        mainNav.classList.toggle('active');
        this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
    });

    // Close menu when clicking on a link (for mobile)
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth < 768) {
                mainNav.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Update active link based on current page
    const currentPage = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        }
    });
});