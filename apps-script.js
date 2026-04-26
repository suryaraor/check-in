// Google Apps Script for Walkathon Check-in
// Deploy as web app: Deploy > New Deployment > Web app > Execute as: Your account > Allow: Anyone

// Get all participants data
function doGet(e) {
  const sheetId = e.parameter.sheetId;
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  try {
    let result;
    if (action === 'getParticipants') {
      result = getParticipants(sheetId);
    } else if (action === 'checkIn') {
      const participantId = e.parameter.id;
      const checkedIn = e.parameter.checkedIn === 'true';
      result = updateCheckIn(sheetId, participantId, checkedIn);
    } else {
      result = { success: false, error: 'Unknown action' };
    }

    if (callback) {
      return ContentService.createTextOutput(`${callback}(${JSON.stringify(result)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
      
  } catch (error) {
    const errorResult = {
      success: false,
      error: error.toString()
    };

    if (callback) {
      return ContentService.createTextOutput(`${callback}(${JSON.stringify(errorResult)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

// Handle POST requests
function doPost(e) {
  const sheetId = e.parameter.sheetId;
  const action = e.parameter.action;
  
  try {
    let result;
    if (action === 'checkIn') {
      const payload = JSON.parse(e.postData.contents);
      result = updateCheckIn(sheetId, payload.id, payload.checkedIn);
    } else {
      result = { success: false, error: 'Unknown action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

// Handle OPTIONS requests (preflight)
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Get all participants from the sheet
function getParticipants(sheetId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return { success: false, error: 'No data found' };
    }
    
    const headers = data[0];
    
    // Find column indices
    const idIndex = headers.findIndex(h => String(h).toLowerCase().includes('id'));
    const firstNameIndex = headers.findIndex(h => String(h).toLowerCase().includes('first'));
    const lastNameIndex = headers.findIndex(h => String(h).toLowerCase().includes('last'));
    const checkInIndex = headers.length - 1; // Last column
    
    if (idIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
      return { 
        success: false, 
        error: 'Missing required columns: ID, First Name, Last Name'
      };
    }
    
    // Parse participants
    const participants = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const firstName = String(row[firstNameIndex] || '').trim();
      const lastName = String(row[lastNameIndex] || '').trim();
      
      // Skip empty rows
      if (!firstName && !lastName) continue;
      
      participants.push({
        rowIndex: i + 1, // Google Sheets 1-indexed (accounting for header)
        id: String(row[idIndex] || `${i}`).trim(),
        firstName: firstName,
        lastName: lastName,
        checkedIn: String(row[checkInIndex] || '').toLowerCase() === 'yes'
      });
    }
    
    return {
      success: true,
      data: participants,
      total: participants.length
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Update check-in status
function updateCheckIn(sheetId, participantId, checkedIn) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return { success: false, error: 'No data found' };
    }
    
    const headers = data[0];
    const idIndex = headers.findIndex(h => String(h).toLowerCase().includes('id'));
    const checkInIndex = headers.length - 1;
    
    // Find the participant row
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][idIndex]).trim() === String(participantId).trim()) {
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Participant not found' };
    }
    
    // Update the check-in column (use actual Google Sheets row index)
    const actualRow = rowIndex + 1; // +1 because rowIndex is 0-based from data[1]
    const checkInColumn = checkInIndex + 1; // +1 because column indices are 1-based in Sheets
    
    const range = sheet.getRange(actualRow, checkInColumn);
    range.setValue(checkedIn ? 'Yes' : 'No');
    
    return {
      success: true,
      message: `Check-in updated for participant ${participantId}`
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Test function (optional - for debugging)
function testGetParticipants() {
  const result = getParticipants('1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms');
  Logger.log(JSON.stringify(result, null, 2));
}
