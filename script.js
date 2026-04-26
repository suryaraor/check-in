// Configuration
let CONFIG = {
    sheetId: localStorage.getItem('walkathon_sheetId') || '1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms',
    appsScriptUrl: localStorage.getItem('walkathon_appsScriptUrl') || 'https://script.google.com/macros/s/AKfycbyhwIdqNKoconoY2MhM6YJWb6ZSJvBhbLMOlHyQEXet5AocCmwGF9GZOlrsGLpKbKwPLA/exec',
    range: 'A:F' // ID, FirstName, LastName, (optional columns), CheckInStatus
};

// Data storage
let participantsData = [];
let checkedInIds = new Set();
let jsonpCounter = 0;

function buildAppsScriptUrl(params) {
    const query = new URLSearchParams(params).toString();
    return `${CONFIG.appsScriptUrl}?${query}`;
}

function normalizeText(value) {
    return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function jsonpRequest(params) {
    return new Promise((resolve, reject) => {
        const callbackName = `walkathonJsonpCb_${Date.now()}_${jsonpCounter++}`;
        const script = document.createElement('script');
        const cleanup = () => {
            delete window[callbackName];
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };

        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Request timed out'));
        }, 15000);

        window[callbackName] = (data) => {
            clearTimeout(timeoutId);
            cleanup();
            resolve(data);
        };

        script.onerror = () => {
            clearTimeout(timeoutId);
            cleanup();
            reject(new Error('Unable to reach Apps Script endpoint'));
        };

        script.src = buildAppsScriptUrl({
            ...params,
            callback: callbackName
        });

        document.body.appendChild(script);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Search input listener
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm.length >= 1) {
        performSearch(searchTerm);
    } else {
        clearResults();
    }
});

// Initialize app
async function initializeApp() {
    if (!CONFIG.sheetId || !CONFIG.appsScriptUrl) {
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

// Load data from Apps Script
async function loadParticipantsData() {
    try {
        const data = await jsonpRequest({
            sheetId: CONFIG.sheetId,
            action: 'getParticipants'
        });

        if (!data.success) {
            throw new Error(data.error || 'Failed to load data');
        }

        participantsData = data.data || [];

        if (participantsData.length === 0) {
            showError('No participants were loaded. Check your sheet data and header names (ID, First Name, Last Name).');
        }

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
    const normalizedSearch = normalizeText(searchTerm);
    const matches = participantsData.filter(p => {
        const firstName = normalizeText(p.firstName);
        const lastName = normalizeText(p.lastName);
        const fullName = `${firstName} ${lastName}`.trim();
        const id = normalizeText(p.id);

        return firstName.includes(normalizedSearch)
            || lastName.includes(normalizedSearch)
            || fullName.includes(normalizedSearch)
            || id.includes(normalizedSearch);
    });

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
        await updateCheckInStatus(participant.id, true, participant.rowIndex);
        checkedInIds.add(participant.id);
        updateCheckInCount();
        
        // Re-render to show updated status
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm.length >= 1) {
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
            updateCheckInStatus(member.id, true, member.rowIndex)
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
        if (searchTerm.length >= 1) {
            performSearch(searchTerm);
        }
    } catch (error) {
        showError(`Failed to check-in: ${error.message}`);
    }
}

// Undo check-in
async function undoCheckIn(participant) {
    try {
        await updateCheckInStatus(participant.id, false, participant.rowIndex);
        checkedInIds.delete(participant.id);
        updateCheckInCount();

        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm.length >= 1) {
            performSearch(searchTerm);
        }
    } catch (error) {
        showError(`Failed to undo check-in: ${error.message}`);
    }
}

// Update check-in status via Apps Script
async function updateCheckInStatus(participantId, checkedIn, rowIndex) {
    try {
        const data = await jsonpRequest({
            sheetId: CONFIG.sheetId,
            action: 'checkIn',
            id: participantId,
            rowIndex: rowIndex,
            checkedIn: checkedIn ? 'true' : 'false'
        });

        if (!data.success) {
            throw new Error(data.error || 'Update failed');
        }

        return data;
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

function showSetupInstructions() {
    document.getElementById('setupInstructions').innerHTML = `
        <h3>⚙️ Configuration Required</h3>
        <p>Please configure your Google Sheet connection:</p>
        <label for="sheetId"><strong>Google Sheet ID:</strong></label>
        <input type="text" id="sheetId" value="${CONFIG.sheetId}" placeholder="e.g., 1abc123xyz456def" class="config-input">
        <label for="appsScriptUrl"><strong>Apps Script URL:</strong></label>
        <input type="text" id="appsScriptUrl" value="${CONFIG.appsScriptUrl}" placeholder="https://script.google.com/macros/s/.../exec" class="config-input">
        <button onclick="saveConfiguration()" class="btn-primary" style="width: 100%; margin-top: 10px;">Save Configuration</button>
        <p class="setup-hint" style="margin-top: 15px;">📖 <a href="#" onclick="showSetupGuide(); return false;">Click here for setup instructions</a></p>
    `;
    document.getElementById('setupInstructions').style.display = 'block';
}

function saveConfiguration() {
    const sheetId = document.getElementById('sheetId').value.trim();
    const appsScriptUrl = document.getElementById('appsScriptUrl').value.trim();

    if (!sheetId || !appsScriptUrl) {
        showError('Please fill in both Sheet ID and Apps Script URL');
        return;
    }

    CONFIG.sheetId = sheetId;
    CONFIG.appsScriptUrl = appsScriptUrl;

    localStorage.setItem('walkathon_sheetId', sheetId);
    localStorage.setItem('walkathon_appsScriptUrl', appsScriptUrl);

    document.getElementById('setupInstructions').style.display = 'none';
    initializeApp();
}

function showSetupGuide() {
    const guide = `
📋 SETUP GUIDE - Google Apps Script Backend

STEP 1: Get Apps Script Code
- Open this file: apps-script.js
- Copy all the code

STEP 2: Create Google Apps Script
- Open your Google Sheet: https://docs.google.com/spreadsheets/d/1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms/
- Click: Extensions > Apps Script
- Delete any existing code
- Paste the code from apps-script.js
- Save the project (Ctrl+S)

STEP 3: Deploy as Web App
- Click: "Deploy" > "New Deployment"
- Select: Type = "Web app"
- Set: Execute as = Your Account
- Set: Who has access = "Anyone"
- Click: "Deploy"
- Copy the deployment URL shown

STEP 4: Configure Check-in App
- Sheet ID: 1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms
- Apps Script URL: Paste the deployment URL
- Click: "Save Configuration"

DONE! ✅ You're ready to check people in!

⚠️ Important Notes:
- The Apps Script URL looks like:
    https://script.google.com/macros/s/YOUR_ID_HERE/exec
- Keep the deployment URL in a safe place
- You can redeploy at any time if needed
    `;
    
    alert(guide);
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
