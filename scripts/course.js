// Course data and filtering functionality
document.addEventListener('DOMContentLoaded', function () {
    // Course data array (from assignment)
    const courses = [
        { code: "CSE 110", name: "Programming Building Blocks", credits: 3, prefix: "cse", completed: false },
        { code: "WDD 130", name: "Web Fundamentals", credits: 3, prefix: "wdd", completed: true },
        { code: "CSE 111", name: "Programming with Functions", credits: 3, prefix: "cse", completed: false },
        { code: "CSE 210", name: "Programming with Classes", credits: 3, prefix: "cse", completed: false },
        { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, prefix: "wdd", completed: true },
        { code: "WDD 231", name: "Frontend Web Development I", credits: 3, prefix: "wdd", completed: false }
    ];

    const courseContainer = document.getElementById('course-cards');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('total-credits');

    // Function to display courses
    function displayCourses(filter = 'all') {
        // Clear container
        courseContainer.innerHTML = '';

        // Filter courses
        let filteredCourses = courses;
        if (filter !== 'all') {
            filteredCourses = courses.filter(course => course.prefix === filter);
        }

        // Create and append course cards
        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;

            courseCard.innerHTML = `
                <div class="course-code">${course.code}</div>
                <div class="course-name">${course.name}</div>
                <div class="course-credits">${course.credits} credits</div>
                <div class="course-status">${course.completed ? '✓ Completed' : 'In Progress'}</div>
            `;

            courseContainer.appendChild(courseCard);
        });

        // Update total credits
        updateTotalCredits(filteredCourses);
    }

    // Function to update total credits
    function updateTotalCredits(coursesArray) {
        const totalCredits = coursesArray.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value and display courses
            const filter = this.getAttribute('data-filter');
            displayCourses(filter);
        });
    });

    // Initial display (all courses)
    displayCourses('all');
});