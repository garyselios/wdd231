// Display form data from URL parameters
document.addEventListener('DOMContentLoaded', function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Display form data
    const firstName = urlParams.get('firstName') || 'Not provided';
    const lastName = urlParams.get('lastName') || 'Not provided';
    const email = urlParams.get('email') || 'Not provided';
    const phone = urlParams.get('phone') || 'Not provided';
    const businessName = urlParams.get('businessName') || 'Not provided';
    const membership = urlParams.get('membership') || 'Not selected';
    const timestamp = urlParams.get('timestamp') || new Date().toISOString();

    // Update display elements
    document.getElementById('displayName').textContent = `${firstName} ${lastName}`;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayPhone').textContent = formatPhoneNumber(phone);
    document.getElementById('displayBusiness').textContent = businessName;
    document.getElementById('displayMembership').textContent = getMembershipLevelName(membership);
    document.getElementById('displayTimestamp').textContent = formatTimestamp(timestamp);

    // Generate application ID
    generateApplicationId();

    // If no form data was passed, show error message
    if (!urlParams.toString()) {
        document.querySelector('.thankyou-message').textContent =
            'No application data was received. Please submit the application form again.';
        document.querySelector('.confirmation-card').style.display = 'none';
    }
});

// Convert membership code to full name
function getMembershipLevelName(level) {
    const levels = {
        'np': 'NP Membership (Non-Profit Organization)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    return levels[level] || level;
}

// Format timestamp to readable date
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Date not available';
    }
}

// Format phone number for better display
function formatPhoneNumber(phone) {
    if (!phone || phone === 'Not provided') return phone;

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format based on length
    if (cleaned.length === 11) {
        return `+${cleaned.substring(0, 2)} (${cleaned.substring(2, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    } else {
        return phone;
    }
}

// Generate a random application ID
function generateApplicationId() {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('idNumber').textContent = randomId;

    // Store in localStorage for reference
    localStorage.setItem('lastApplicationId', `CHMB-${randomId}`);
}

// Update current year in footer
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('currentyear').textContent = new Date().getFullYear();
});