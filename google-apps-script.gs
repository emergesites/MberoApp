const QUOTE_SHEET_NAME = 'Quote Requests';
const CONTRACTOR_SHEET_NAME = 'Contractor Registrations';
const NOTIFICATION_EMAIL = 'okcharliesa@gmail.com';

function myFunction() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

function doGet() {
  return jsonResponse({ success: true, message: 'SMP web app is running.' });
}

function doPost(e) {
  try {
    const payload = getPayload_(e);
    const formType = payload.formType === 'contractor' ? 'contractor' : 'quote';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw new Error('Open this Apps Script from the target Google Sheet before deploying the web app.');
    }

    if (formType === 'quote') {
      saveQuote_(spreadsheet, payload);
      sendQuoteEmail_(payload);
    } else {
      saveContractor_(spreadsheet, payload);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function saveQuote_(spreadsheet, payload) {
  const headers = [
    'Submitted At',
    'Name',
    'Phone',
    'Email',
    'Service',
    'Location',
    'Preferred Date',
    'Details',
    'Photo Link'
  ];

  const row = [
    payload.submittedAt || new Date().toISOString(),
    payload.name || '',
    payload.phone || '',
    payload.email || '',
    payload.service || '',
    payload.location || '',
    payload.preferredDate || '',
    payload.details || '',
    payload.photoLink || ''
  ];

  appendRow_(spreadsheet, QUOTE_SHEET_NAME, headers, row);
}

function saveContractor_(spreadsheet, payload) {
  const headers = [
    'Submitted At',
    'Name',
    'Phone',
    'Email',
    'Area',
    'Service',
    'Experience',
    'Notes'
  ];

  const row = [
    payload.submittedAt || new Date().toISOString(),
    payload.name || '',
    payload.phone || '',
    payload.email || '',
    payload.area || '',
    payload.service || '',
    payload.experience || '',
    payload.notes || ''
  ];

  appendRow_(spreadsheet, CONTRACTOR_SHEET_NAME, headers, row);
}

function appendRow_(spreadsheet, sheetName, headers, row) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  sheet.appendRow(row);
}

function sendQuoteEmail_(payload) {
  const subject = 'New SMP quote request';
  const body = [
    'A new quote request was submitted.',
    '',
    'Name: ' + (payload.name || ''),
    'Phone: ' + (payload.phone || ''),
    'Email: ' + (payload.email || ''),
    'Service: ' + (payload.service || ''),
    'Location: ' + (payload.location || ''),
    'Preferred Date: ' + (payload.preferredDate || ''),
    'Details: ' + (payload.details || ''),
    'Photo Link: ' + (payload.photoLink || '')
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    replyTo: payload.email || NOTIFICATION_EMAIL,
    subject,
    body
  });
}

function getPayload_(e) {
  const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';

  if (rawBody) {
    return JSON.parse(rawBody);
  }

  return e && e.parameter ? e.parameter : {};
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
