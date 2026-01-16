
document.addEventListener('DOMContentLoaded', async function () {
    // DOM Elements
    const membersContainer = document.getElementById('members-container');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const membershipFilter = document.getElementById('membership-filter');
    const memberCountElement = document.getElementById('member-count');
    const totalMembersElement = document.getElementById('total-members');

    // State
    let members = [];
    let filteredMembers = [];
    let currentView = 'grid'; // 'grid' or 'list'

    try {
        // Load members data
        members = await loadMembers();
        filteredMembers = [...members];

        // Update stats
        updateStats();

        // Initial render
        renderMembers();

        // Set up event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Error loading members:', error);
        showErrorMessage();
    }

    // Function to load members from JSON file
    async function loadMembers() {
        try {
            const response = await fetch('data/members.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Add placeholder images if image files don't exist
            return data.map(member => ({
                ...member,
                imageUrl: `images/${member.image}`,
                hasImage: true // In real implementation, check if file exists
            }));

        } catch (error) {
            console.error('Failed to load members:', error);
            throw error;
        }
    }

    // Function to render members based on current view
    function renderMembers() {
        membersContainer.innerHTML = '';

        if (filteredMembers.length === 0) {
            showNoResultsMessage();
            return;
        }

        // Remove loading class
        membersContainer.classList.remove('loading-message');

        // Set the appropriate class for the container
        membersContainer.className = 'members-container';
        membersContainer.classList.add(currentView === 'grid' ? 'grid-view' : 'list-view');

        // Render each member
        filteredMembers.forEach(member => {
            const memberElement = currentView === 'grid'
                ? createMemberCard(member)
                : createMemberListItem(member);

            membersContainer.appendChild(memberElement);
        });

        // Update stats
        updateStats();
    }

    // Function to create a grid card for a member
    function createMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'member-card';

        // Get badge class based on membership level
        const badgeClass = getBadgeClass(member.membership);
        const badgeText = getMembershipText(member.membership);

        card.innerHTML = `
            <div class="member-image">
                ${member.hasImage
                ? `<img src="${member.imageUrl}" alt="${member.name}" loading="lazy">`
                : `<div>${member.name.charAt(0)}</div>`
            }
            </div>
            <div class="member-info">
                <div class="member-header">
                    <h3 class="member-name">${member.name}</h3>
                    <span class="member-badge ${badgeClass}">${badgeText}</span>
                </div>
                
                <div class="member-details">
                    <p>📍 ${member.address}</p>
                    <p>📞 ${member.phone}</p>
                    <p>🌐 <a href="${member.website}" target="_blank" rel="noopener">Visit website</a></p>
                    <p>✉️ ${member.email || 'N/A'}</p>
                </div>
                
                <div class="member-category">${member.category}</div>
                
                ${member.description ? `
                    <div class="member-description">
                        ${member.description}
                    </div>
                ` : ''}
                
                <div class="member-footer">
                    <small>Member since: ${member.yearFounded || 'N/A'}</small>
                </div>
            </div>
        `;

        return card;
    }

    // Function to create a list item for a member
    function createMemberListItem(member) {
        const listItem = document.createElement('div');
        listItem.className = 'member-list-item';

        // Get badge class based on membership level
        const badgeClass = getBadgeClass(member.membership);
        const badgeText = getMembershipText(member.membership);

        listItem.innerHTML = `
            <div class="list-item-header">
                <h3 class="member-name">${member.name}</h3>
                <span class="member-badge ${badgeClass}">${badgeText}</span>
            </div>
            
            <div class="list-item-content">
                <div class="list-item-details">
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Category:</strong> ${member.category}</p>
                    <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
                </div>
                
                <div class="list-item-actions">
                    <a href="${member.website}" target="_blank" rel="noopener">
                        🌐 Website
                    </a>
                    <a href="tel:${member.phone.replace(/\D/g, '')}">
                        📞 Call
                    </a>
                </div>
            </div>
            
            ${member.description ? `
                <div class="member-description">
                    <strong>Description:</strong> ${member.description}
                </div>
            ` : ''}
        `;

        return listItem;
    }

    // Function to get badge CSS class based on membership level
    function getBadgeClass(membershipLevel) {
        switch (parseInt(membershipLevel)) {
            case 1: return 'badge-bronze';
            case 2: return 'badge-silver';
            case 3: return 'badge-gold';
            default: return 'badge-bronze';
        }
    }

    // Function to get membership text
    function getMembershipText(membershipLevel) {
        switch (parseInt(membershipLevel)) {
            case 1: return 'Member';
            case 2: return 'Silver';
            case 3: return 'Gold';
            default: return 'Member';
        }
    }

    // Function to filter members based on selected membership level
    function filterMembers() {
        const selectedValue = membershipFilter.value;

        if (selectedValue === 'all') {
            filteredMembers = [...members];
        } else {
            filteredMembers = members.filter(member =>
                member.membership.toString() === selectedValue
            );
        }

        renderMembers();
    }

    // Function to update statistics display
    function updateStats() {
        if (memberCountElement) {
            memberCountElement.textContent = filteredMembers.length;
        }
        if (totalMembersElement) {
            totalMembersElement.textContent = members.length;
        }
    }

    // Function to show error message
    function showErrorMessage() {
        membersContainer.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ Error loading directory</h3>
                <p>Could not load member data. Please try again later.</p>
            </div>
        `;
    }

    // Function to show no results message
    function showNoResultsMessage() {
        membersContainer.innerHTML = `
            <div class="empty-state">
                <h3>🔍 No members found</h3>
                <p>No members match the selected filters.</p>
                <button onclick="resetFilters()" class="view-btn">Reset filters</button>
            </div>
        `;
    }

    // Function to reset filters
    window.resetFilters = function () {
        membershipFilter.value = 'all';
        filterMembers();
    };

    // Function to set up event listeners
    function setupEventListeners() {
        // View toggle buttons
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', function () {
                if (currentView !== 'grid') {
                    currentView = 'grid';
                    gridViewBtn.classList.add('active');
                    listViewBtn.classList.remove('active');
                    renderMembers();
                }
            });
        }

        if (listViewBtn) {
            listViewBtn.addEventListener('click', function () {
                if (currentView !== 'list') {
                    currentView = 'list';
                    listViewBtn.classList.add('active');
                    gridViewBtn.classList.remove('active');
                    renderMembers();
                }
            });
        }

        // Membership filter
        if (membershipFilter) {
            membershipFilter.addEventListener('change', filterMembers);
        }
    }
});