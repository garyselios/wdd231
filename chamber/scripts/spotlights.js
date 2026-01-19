

import { formatPhoneNumber } from './main.js';

const MEMBERS_JSON_URL = 'data/members.json';

export async function loadSpotlights() {
    try {
        const response = await fetch(MEMBERS_JSON_URL);
        if (!response.ok) throw new Error('Failed to load members');

        const members = await response.json();
        const spotlightMembers = selectSpotlightMembers(members);
        displaySpotlights(spotlightMembers);

    } catch (error) {
        console.error('Error loading spotlights:', error);
        displaySpotlightsError();
    }
}

function selectSpotlightMembers(members) {
    // Filter Gold and Silver members
    const qualified = members.filter(m =>
        m.membershipLevel === 'Gold' || m.membershipLevel === 'Silver'
    );

    // Shuffle and select 2-3 members
    const shuffled = [...qualified].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlightsContainer');
    if (!container) return;

    container.innerHTML = '';

    members.forEach(member => {
        const card = createSpotlightCard(member);
        container.appendChild(card);
    });
}

function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    // Format website for display
    let websiteDisplay = member.website;
    if (websiteDisplay.startsWith('http://')) {
        websiteDisplay = websiteDisplay.substring(7);
    } else if (websiteDisplay.startsWith('https://')) {
        websiteDisplay = websiteDisplay.substring(8);
    }

    card.innerHTML = `
        <img src="${member.image || 'images/members/default.png'}" 
             alt="${member.name} logo" 
             width="120" 
             height="80" 
             loading="lazy">
        <h3>${member.name}</h3>
        <p class="spotlight-address">📍 ${member.address}</p>
        <p class="spotlight-phone">📞 ${formatPhoneNumber(member.phone.replace(/\D/g, ''))}</p>
        <p class="spotlight-website">
            <a href="${member.website}" target="_blank" rel="noopener">
                ${websiteDisplay}
            </a>
        </p>
        <span class="membership-badge ${member.membershipLevel.toLowerCase()}">
            ${member.membershipLevel} Member
        </span>
    `;

    return card;
}

function displaySpotlightsError() {
    const container = document.getElementById('spotlightsContainer');
    if (container) {
        container.innerHTML = `
            <div class="spotlight-error">
                <p>Spotlight members unavailable at this time.</p>
                <p>Please check back later.</p>
            </div>
        `;
    }
}

// Auto-initialize if script is loaded in home page
if (document.getElementById('spotlightsContainer')) {
    document.addEventListener('DOMContentLoaded', loadSpotlights);
}