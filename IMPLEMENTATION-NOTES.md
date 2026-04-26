# Technical Implementation Notes

This document explains the technical architecture and code structure for developers who want to customize or extend the check-in system.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Static Website (HTML/CSS/JS)    │
│  - No server needed                     │
│  - Runs entirely in browser             │
│  - Responsive design                    │
└─────────────────┬───────────────────────┘
                  │
                  ├─→ LocalStorage
                  │   (Sheet ID, API Key)
                  │
                  └─→ Google Sheets API
                      (Read/Write Data)
```

## File Structure

### index.html
- **Purpose:** Main UI structure and layout
- **Key Elements:**
  - Header with check-in counter
  - Search input box
  - Results list container
  - Loading and error indicators
  - Setup instructions modal

### style.css
- **Purpose:** All visual styling and responsiveness
- **Key Sections:**
  - Header gradient styling
  - Search input styling
  - Family group and participant cards
  - Bulk action buttons
  - Mobile responsive design
  - Smooth animations and transitions

### script.js
- **Purpose:** All application logic
- **Key Functions:**

#### Configuration Management
- `saveConfiguration()` - Store Sheet ID and API Key in localStorage
- `loadConfiguration()` - Retrieve configuration from storage

#### Data Loading
- `loadParticipantsData()` - Fetch data from Google Sheets API
  - Parses headers (ID, First Name, Last Name)
  - Extracts participant rows
  - Identifies check-in status column

#### Search & Display
- `performSearch(searchTerm)` - Filter by last name prefix
- `groupByLastName(participants)` - Group results by family
- `renderResults(grouped)` - Render search results with interactive controls

#### Check-in Operations
- `checkInParticipant(participant)` - Check-in single person
- `checkInMultiple(members, checkboxStates)` - Bulk check-in
- `undoCheckIn(participant)` - Reverse a check-in
- `updateCheckInStatus(participantId, checkedIn)` - Update Google Sheet

#### UI Updates
- `updateCheckInCount()` - Update display counter
- `showError(message)` - Display error messages
- `showLoading(show)` - Show/hide loading indicator

## Data Flow

### Initial Load
```
Page Load
  ↓
Check localStorage for config
  ↓
If not configured:
  Show setup form
  ↓
User enters Sheet ID & API Key
  ↓
Fetch data from Google Sheets API
  ↓
Parse participants and load into memory
  ↓
Display counter with total count
```

### Search & Check-in
```
User types last name
  ↓
Filter participants by last name prefix
  ↓
Group by family (last name)
  ↓
Render with checkboxes and buttons
  ↓
User selects and clicks "Check-in"
  ↓
Send update to Google Sheets API
  ↓
Update local cache (checkedInIds Set)
  ↓
Update counter display
  ↓
Re-render results
```

## Key Data Structures

### participantsData (Array)
```javascript
[
  {
    rowIndex: 2,           // Google Sheet row number
    id: "1",               // Unique identifier
    firstName: "John",     // First name
    lastName: "Doe",       // Last name
    checkedIn: false       // Status
  },
  ...
]
```

### checkedInIds (Set)
```javascript
new Set(["1", "2", "4"])  // IDs of checked-in participants
```

## API Integration

### Google Sheets API v4

**Endpoints Used:**

1. **Read Data**
   ```
   GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}
   ```
   - Fetches all participant data
   - No authentication needed if sheet is public
   - API Key in query parameter

2. **Update Data**
   ```
   PUT https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}
   ```
   - Updates check-in status for one person
   - One request per check-in
   - Requires API Key

## Column Mapping

The app automatically detects columns by searching headers:

```javascript
// Header matching (case-insensitive)
idIndex = headers.find(h => h.toLowerCase().includes('id'))
firstNameIndex = headers.find(h => h.toLowerCase().includes('first'))
lastNameIndex = headers.find(h => h.toLowerCase().includes('last'))
checkInIndex = headers.length - 1  // Always last column
```

## Error Handling

The app handles several error scenarios:

1. **Configuration Missing** → Show setup form
2. **API Key Invalid** → Display error, suggest reconfigure
3. **Sheet Not Shared** → Error with link to docs
4. **Missing Columns** → Error listing required columns
5. **Update Failed** → Error with retry button

## Browser Storage

### LocalStorage Keys
```javascript
'walkathon_sheetId'  // Google Sheet ID
'walkathon_apiKey'   // Google API Key
```

Data persists across browser sessions until cleared.

## Performance Considerations

### Current Implementation
- **All-in-memory:** Participants loaded once into memory
- **Instant search:** Filter happens client-side (no API calls)
- **Batch updates:** Each check-in is one API call

### Optimizations for Large Datasets
If you have 1000+ participants:
1. Paginate the sheet reading
2. Implement virtual scrolling for results
3. Batch updates (check-in 5 people per API call)
4. Add debouncing to search input

## Customization Points

### Styling
- Colors: Edit CSS variables in `:root`
- Fonts: Change font-family in `body`
- Layouts: Modify CSS grid/flex properties

### Functionality
- Search: Modify `performSearch()` function
- Check-in logic: Edit `checkInParticipant()` function
- Data fields: Update column parsing in `loadParticipantsData()`

### Validation
- Add name validation before check-in
- Add duplicate ID checking
- Implement check-in timestamp tracking

## Security Notes

### Current Setup
- API Key is visible in browser (client-side)
- No authentication beyond API Key
- Data is public (anyone with link can see)

### Security Improvements
1. **Server-side proxy:** Don't expose API Key
2. **OAuth 2.0:** Use Google sign-in instead of API Key
3. **Row-level permissions:** Only allow updates to check-in column
4. **IP whitelisting:** Restrict API Key to your domain

### Best Practices
- Rotate API Key monthly
- Don't commit API Key to public repos
- Use environment variables in production
- Log check-ins for audit purposes

## Testing

### Manual Testing Checklist
- [ ] Search works with partial last names
- [ ] Family grouping shows correctly
- [ ] Single check-in updates sheet
- [ ] Bulk check-in works
- [ ] Undo reverses check-in
- [ ] Counter updates accurately
- [ ] Works on mobile browser
- [ ] Works offline (cached data)

### Unit Test Examples (Jest)
```javascript
// Test search function
test('search filters by last name prefix', () => {
  const results = performSearch('do');
  expect(results).toContainEqual(expect.objectContaining({
    lastName: 'Doe'
  }));
});

// Test check-in
test('check-in updates count', async () => {
  await checkInParticipant(participant);
  expect(checkedInIds.has('1')).toBe(true);
});
```

## Deployment

### Static Hosting
Works on any static hosting:
- GitHub Pages
- Vercel
- Netlify
- S3 + CloudFront
- Firebase Hosting
- Your own web server

### Environment Variables (if using build process)
```
REACT_APP_SHEET_ID = your_sheet_id
REACT_APP_API_KEY = your_api_key
```

## Future Enhancements

Potential improvements:
1. **Offline support:** Service Workers for offline check-ins
2. **Voice search:** Speak last name instead of typing
3. **QR codes:** Scan participant QR codes
4. **Photos:** Display participant photos
5. **Verification:** Two-step check-in with phone number
6. **Analytics:** Charts showing check-in progress
7. **Multi-event:** Support multiple events in one sheet
8. **Notifications:** Alert when all participants checked in

## Troubleshooting Guide

### JavaScript Console Errors
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Screenshot and report

### Common Console Errors
```
CORS Error → API Key not public, or API not enabled
404 Not Found → Sheet ID incorrect
Unauthorized → API Key invalid or no permission
```

### Performance Issues
- Reduce dataset size for testing
- Use local server instead of file://
- Check browser memory usage (Task Manager)
- Profile with Chrome DevTools

## Code Maintenance

### Standards
- Use semicolons
- Use const/let, not var
- 2-space indentation
- Descriptive variable names
- Comments for complex logic

### Documentation
- Update comments when changing code
- Test all changes before deploying
- Keep README.md current
- Document any API changes

---

For questions or improvements, feel free to fork and modify!
