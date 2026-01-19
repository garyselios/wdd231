
// ==============================
// CONFIGURATION
// ==============================
const MEMBERS_JSON_URL = 'data/members.json'; // Path to your JSON file
const SPOTLIGHTS_CONTAINER_ID = 'spotlightsContainer'; // Matches your HTML ID
const NUM_SPOTLIGHTS = 2; // You have 2 spotlight cards in your HTML

// ==============================
// MAIN FUNCTION - LOAD AND DISPLAY SPOTLIGHTS
// ==============================
async function loadMemberSpotlights() {
    try {
        console.log('Loading member spotlights...');

        // Get the container element
        const container = document.getElementById(SPOTLIGHTS_CONTAINER_ID);

        if (!container) {
            console.error(`Container with ID '${SPOTLIGHTS_CONTAINER_ID}' not found`);
            return;
        }

        // Show loading state
        container.innerHTML = `
            <div class="spotlight-card loading">
                <div class="skeleton-logo"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
            <div class="spotlight-card loading">
                <div class="skeleton-logo"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `;

        // Fetch members data
        const response = await fetch(MEMBERS_JSON_URL);

        if (!response.ok) {
            throw new Error(`Failed to load members data: ${response.status}`);
        }

        const members = await response.json();
        console.log(`Loaded ${members.length} members from JSON`);

        // Filter for qualified members (Gold or Silver)
        const qualifiedMembers = members.filter(member =>
            member.membership === 3 || member.membership === 2
        );

        // Select random members for spotlight
        let spotlightMembers;

        if (qualifiedMembers.length >= NUM_SPOTLIGHTS) {
            spotlightMembers = getRandomMembers(qualifiedMembers, NUM_SPOTLIGHTS);
        } else {
            // If not enough Gold/Silver, use any members
            console.log(`Not enough Gold/Silver members, using all members`);
            spotlightMembers = getRandomMembers(members, NUM_SPOTLIGHTS);
        }

        // Display the spotlight members
        displaySpotlights(spotlightMembers, container);

    } catch (error) {
        console.error('Error loading member spotlights:', error);
        showSpotlightError();
    }
}

// ==============================
// GET RANDOM MEMBERS FROM ARRAY
// ==============================
function getRandomMembers(members, count) {
    // Create a copy to avoid modifying the original array
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// ==============================
// DISPLAY SPOTLIGHTS IN CONTAINER
// ==============================
function displaySpotlights(members, container) {
    // Clear container
    container.innerHTML = '';

    // Create and append spotlight cards
    members.forEach(member => {
        const card = createSpotlightCard(member);
        container.appendChild(card);
    });

    console.log(`Displayed ${members.length} spotlight members`);
}

// ==============================
// CREATE SPOTLIGHT CARD ELEMENT
// ==============================
function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    // Determine membership badge color
    const badgeColor = getMembershipColor(member.membershipName);

    card.innerHTML = `
        <div class="company-logo">
            <img src="images/${member.image}" alt="${member.name}" loading="lazy">
            <span class="membership-badge" style="background-color: ${badgeColor}">
                ${member.membershipName}
            </span>
        </div>
        <div class="company-info">
            <h3>${member.name}</h3>
            <p class="industry">${member.category}</p>
            <p class="description">${member.description}</p>
            <div class="contact-info">
                <p><i class="fas fa-phone"></i> ${member.phone}</p>
                <p><i class="fas fa-envelope"></i> ${member.email}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
            </div>
            <div class="company-meta">
                <span class="founded">Founded: ${member.yearFounded}</span>
                <a href="${member.website}" class="website-link" target="_blank" rel="noopener">
                    Visit Website <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;

    return card;
}

// ==============================
// GET MEMBERSHIP BADGE COLOR
// ==============================
function getMembershipColor(membershipName) {
    const colors = {
        'Gold': '#FFD700',
        'Silver': '#C0C0C0',
        'Member': '#CD7F32'
    };

    return colors[membershipName] || '#3498db';
}

// ==============================
// SHOW ERROR MESSAGE
// ==============================
function showSpotlightError() {
    const container = document.getElementById(SPOTLIGHTS_CONTAINER_ID);

    if (!container) return;

    container.innerHTML = `
        <div class="spotlight-error" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3em; color: #e74c3c; margin-bottom: 20px;"></i>
            <h3 style="color: #333; margin-bottom: 10px;">Unable to Load Member Spotlights</h3>
            <p style="color: #666;">Please check your internet connection and try again.</p>
            <button onclick="loadMemberSpotlights()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            ">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

// ==============================
// INITIALIZE SPOTLIGHTS
// ==============================
function initSpotlights() {
    console.log('Initializing member spotlights...');

    // Load spotlights when page loads
    window.addEventListener('load', () => {
        // Small delay to ensure everything else is loaded
        setTimeout(loadMemberSpotlights, 500);
    });

    // Optional: Refresh spotlights every hour
    setInterval(loadMemberSpotlights, 60 * 60 * 1000);
}

// ==============================
// CSS FOR SKELETON LOADING (inline if needed)
// ==============================
function addSkeletonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .skeleton-logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
            margin: 0 auto 20px;
        }
        
        .skeleton-text {
            height: 16px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        
        .skeleton-text.short {
            width: 60%;
            margin: 0 auto;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .spotlight-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .spotlight-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        .company-logo {
            position: relative;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .company-logo img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 10px;
            border: 3px solid #f8f9fa;
        }
        
        .membership-badge {
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 12px;
            border-radius: 12px;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
            white-space: nowrap;
        }
        
        .company-info h3 {
            margin: 0 0 8px 0;
            color: #2c3e50;
            font-size: 1.4em;
        }
        
        .industry {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 15px;
            font-size: 0.95em;
        }
        
        .description {
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
            font-size: 0.95em;
        }
        
        .contact-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .contact-info p {
            margin: 8px 0;
            color: #555;
            font-size: 0.9em;
        }
        
        .contact-info i {
            width: 20px;
            color: #3498db;
            margin-right: 8px;
        }
        
        .company-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .founded {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .website-link {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
            font-size: 0.9em;
            transition: color 0.3s ease;
        }
        
        .website-link:hover {
            color: #2980b9;
        }
        
        .spotlights-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        @media (max-width: 768px) {
            .spotlights-container {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==============================
// START THE APPLICATION
// ==============================
// Add skeleton styles
addSkeletonStyles();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlights);
} else {
    initSpotlights();
}