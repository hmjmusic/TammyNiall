/**
 * Google Apps Script — RSVP Form Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and click "New Project"
 * 2. Delete the default code and paste this entire file
 * 3. Click "Deploy" → "New deployment"
 * 4. Choose type: "Web app"
 * 5. Set "Execute as": Me (your Google account)
 * 6. Set "Who has access": Anyone
 * 7. Click "Deploy" and authorize when prompted
 * 8. Copy the Web app URL
 * 9. Paste that URL into js/main.js replacing 'YOUR_GOOGLE_APPS_SCRIPT_URL'
 * 10. The Google Sheet is auto-created on first submission
 * 
 * SHARING: The sheet will be shared with editing access to:
 *   - 1995.tcp1130@gmail.com
 *   - hmjmusic@gmail.com
 *   - niall.bashaw@gmail.com
 */

var SHEET_NAME = 'RSVPs';
var EDITORS = [
  '1995.tcp1130@gmail.com',
  'hmjmusic@gmail.com',
  'niall.bashaw@gmail.com'
];

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    
    var data = e.parameter;
    var timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.attending || '',
      data.guests || '',
      data.guestNames || '',
      data.attire || '',
      data.dietary || '',
      data.song || '',
      data.message || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'RSVP endpoint is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var files = DriveApp.getFilesByName('Tamara & Niall Wedding RSVPs');
  
  if (files.hasNext()) {
    var ss = SpreadsheetApp.open(files.next());
    return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  }
  
  // Create new spreadsheet
  var ss = SpreadsheetApp.create('Tamara & Niall Wedding RSVPs');
  var sheet = ss.getActiveSheet();
  sheet.setName(SHEET_NAME);
  
  // Add headers
  var headers = [
    'Timestamp',
    'Name',
    'Email',
    'Attending',
    'Number of Guests',
    'Guest Names',
    'Attire Choice',
    'Dietary Restrictions',
    'Song Request',
    'Message'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Style header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4a286a');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Share with editors
  var file = DriveApp.getFileById(ss.getId());
  EDITORS.forEach(function(email) {
    try {
      file.addEditor(email);
    } catch (err) {
      Logger.log('Could not add editor ' + email + ': ' + err);
    }
  });
  
  return sheet;
}
