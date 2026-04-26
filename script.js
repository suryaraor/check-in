// Configuration
let CONFIG = {
    sheetId: localStorage.getItem('walkathon_sheetId') || '',
    apiKey: localStorage.getItem('walkathon_apiKey') || '',
    range: 'A:F' // ID, FirstName, LastName, (optional columns), CheckInStatus
};

// Data storage
let participantsData = [];
let checkedInIds = new Set();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Search input listener
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm.length >= 2) {
        performSearch(searchTerm);
    } else {
        clearResults();
    }
});

// Initialize app
async function initializeApp() {
    if (!CONFIG.sheetId || !CONFIG.apiKey) {
        showSetupInstructions();
        return;
    }

    showLoading(true);
    try {
        await loadParticipantsData();
        showLoading(false);
    } catch (error) {
        showError(`Failed to load data: ${error.message}`);
        showLoading(false);
        showSetupInstructions();
    }
}

// Load data from Google Sheet
async function loadParticipantsData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/${CONFIG.range}?key=${CONFIG.apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const rows = data.values || [];

        if (rows.length === 0) {
            throw new Error('No data found in spreadsheet');
        }

        // Parse header
        const headers = rows[0];
        const idIndex = headers.findIndex(h => h.toLowerCase().includes('id'));
        const firstNameIndex = headers.findIndex(h => h.toLowerCase().includes('first'));
        const lastNameIndex = headers.findIndex(h => h.toLowerCase().includes('last'));
        const checkInIndex = headers.length - 1; // Last column is check-in status

        if (idIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
            throw new Error('Missing required columns: ID, First Name, Last Name');
        }

        // Parse data rows
        participantsData = rows.slice(1).map((row, index) => ({
            rowIndex: index + 2, // Google Sheets 1-indexed
            id: row[idIndex]?.trim() || `${index}`,
            firstName: row[firstNameIndex]?.trim() || '',
            lastName: row[lastNameIndex]?.trim() || '',
            checkedIn: row[checkInIndex]?.toLowerCase() === 'yes' || row[checkInIndex]?.toLowerCase() === 'true'
        })).filter(p => p.firstName || p.lastName); // Filter out empty rows

        // Load checked-in status
        participantsData.forEach(p => {
            if (p.checkedIn) {
                checkedInIds.add(p.id);
            }
        });

        updateCheckInCount();

    } catch (error) {
        throw error;
    }
}

// Perform search
function performSearch(searchTerm) {
    const matches = participantsData.filter(p =>
        p.lastName.toLowerCase().startsWith(searchTerm)
    );

    if (matches.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('resultsList').innerHTML = '';
        document.getElementById('searchInfo').textContent = '';
        return;
    }

    document.getElementById('noResults').style.display = 'none';
    document.getElementById('searchInfo').textContent = `Found ${matches.length} participant(s)`;

    // Group by last name
    const grouped = groupByLastName(matches);
    renderResults(grouped);
}

// Group participants by last name
function groupByLastName(participants) {
    const groups = {};
    participants.forEach(p => {
        const key = p.lastName.toUpperCase();
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(p);
    });
    return groups;
}

// Render search results
function renderResults(grouped) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    Object.entries(grouped).forEach(([lastName, members]) => {
        const familyGroup = document.createElement('div');
        familyGroup.className = 'family-group';

        // Family header
        const header = document.createElement('div');
        header.className = 'family-header';
        const checkedCount = members.filter(m => checkedInIds.has(m.id)).length;
        header.innerHTML = `
            <div class="family-header-name">${lastName}</div>
            <div class="family-header-count">${checkedCount}/${members.length} checked in</div>
        `;
        familyGroup.appendChild(header);

        // Family members
        const membersContainer = document.createElement('div');
        membersContainer.className = 'family-members';

        const checkboxStates = {};
        members.forEach(member => {
            checkboxStates[member.id] = false;
        });

        members.forEach(member => {
            const memberElement = document.createElement('div');
            const isCheckedIn = checkedInIds.has(member.id);
            memberElement.className = `participant ${isCheckedIn ? 'checked-in' : ''}`;
            memberElement.dataset.id = member.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = false;
            checkbox.onchange = (e) => {
                checkboxStates[member.id] = e.target.checked;
            };

            const info = document.createElement('div');
            info.className = 'participant-info';
            info.innerHTML = `
                <div class="participant-name">${member.firstName} ${member.lastName}</div>
                <div class="participant-id">ID: ${member.id}</div>
            `;

            const actions = document.createElement('div');
            actions.className = 'participant-actions';

            if (isCheckedIn) {
                const undoBtn = document.createElement('button');
                undoBtn.className = 'btn-undo';
                undoBtn.textContent = 'Undo Check-in';
                undoBtn.onclick = () => undoCheckIn(member);
                actions.appendChild(undoBtn);
            } else {
                const checkBtn = document.createElement('button');
                checkBtn.className = 'btn-check';
                checkBtn.textContent = 'Check-in';
                checkBtn.onclick = () => checkInParticipant(member);
                actions.appendChild(checkBtn);
            }

            memberElement.appendChild(checkbox);
            memberElement.appendChild(info);
            memberElement.appendChild(actions);
            membersContainer.appendChild(memberElement);
        });

        familyGroup.appendChild(membersContainer);

        // Bulk action buttons
        const bulkActions = document.createElement('div');
        bulkActions.className = 'bulk-actions';

        const checkAllBtn = document.createElement('button');
        checkAllBtn.className = 'btn-primary';
        checkAllBtn.textContent = `Check-in Selected (${members.length})`;
        checkAllBtn.onclick = () => checkInMultiple(members, checkboxStates, membersContainer);

        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'btn-secondary';
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.onclick = () => {
            const checkboxes = membersContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = true;
                checkboxStates[cb.parentElement.dataset.id] = true;
            });
        };

        bulkActions.appendChild(selectAllBtn);
        bulkActions.appendChild(checkAllBtn);
        familyGroup.appendChild(bulkActions);

        resultsList.appendChild(familyGroup);
    });
}

// Check in a single participant
async function checkInParticipant(participant) {
    if (checkedInIds.has(participant.id)) {
        return; // Already checked in
    }

    try {
        await updateCheckInStatus(participant.id, true);
        checkedInIds.add(participant.id);
        updateCheckInCount();
        
        // Re-render to show updated status
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm.length >= 2) {
            performSearch(searchTerm);
        }
    } catch (error) {
        showError(`Failed to check-in: ${error.message}`);
    }
}

// Check in multiple participants
async function checkInMultiple(members, checkboxStates, membersContainer) {
    const selectedMembers = members.filter(m => checkboxStates[m.id]);
    
    if (selectedMembers.length === 0) {
        showError('Please select at least one person to check-in');
        return;
    }

    try {
        // Update all in parallel
        await Promise.all(selectedMembers.map(member => 
            updateCheckInStatus(member.id, true)
        ));

        // Add to checked-in set
        selectedMembers.forEach(m => checkedInIds.add(m.id));
        updateCheckInCount();

        // Clear selection and re-render
        membersContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        Object.keys(checkboxStates).forEach(id => checkboxStates[id] = false);

        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm.length >= 2) {
            performSearch(searchTerm);
        }
    } catch (error) {
        showError(`Failed to check-in: ${error.message}`);
    }
}

// Undo check-in
async function undoCheckIn(participant) {
    try {
        await updateCheckInStatus(participant.id, false);
        checkedInIds.delete(participant.id);
        updateCheckInCount();

        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm.length >= 2) {
            performSearch(searchTerm);
        }
    } catch (error) {
        showError(`Failed to undo check-in: ${error.message}`);
    }
}

// Update check-in status in Google Sheet
async function updateCheckInStatus(participantId, checkedIn) {
    const participant = participantsData.find(p => p.id === participantId);
    if (!participant) {
        throw new Error('Participant not found');
    }

    const values = [[checkedIn ? 'Yes' : 'No']];
    const range = `F${participant.rowIndex}`;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/${range}?valueInputOption=USER_ENTERED`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': CONFIG.apiKey
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Update failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Update check-in count display
function updateCheckInCount() {
    document.getElementById('checkedInCount').textContent = checkedInIds.size;
    document.getElementById('totalCount').textContent = participantsData.length;
}

// Clear results
function clearResults() {
    document.getElementById('resultsList').innerHTML = '';
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('searchInfo').textContent = '';
}

// UI Helpers
function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = `
        <span>${message}</span>
        <button class="error-close" onclick="this.parentElement.style.display='none'">×</button>
    `;
    errorElement.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showSetupInstructions() {
    document.getElementById('setupInstructions').style.display = 'block';
}

function saveConfiguration() {
    const sheetId = document.getElementById('sheetId').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!sheetId || !apiKey) {
        showError('Please fill in both Sheet ID and API Key');
        return;
    }

    CONFIG.sheetId = sheetId;
    CONFIG.apiKey = apiKey;

    localStorage.setItem('walkathon_sheetId', sheetId);
    localStorage.setItem('walkathon_apiKey', apiKey);

    document.getElementById('setupInstructions').style.display = 'none';
    initializeApp();
}
