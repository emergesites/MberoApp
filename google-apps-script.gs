const QUOTE_SHEET_NAME = 'Quote Requests';
const CONTRACTOR_SHEET_NAME = 'Contractor Registrations';
const NOTIFICATION_EMAIL = 'smpwecare@gmail.com';

// Brevo API key — stored securely in Project Settings → Script Properties
const BREVO_API_KEY = PropertiesService.getScriptProperties().getProperty('BREVO_API_KEY');
const BREVO_SENDER_EMAIL = 'emergesites@gmail.com';
const BREVO_SENDER_NAME = 'SmP – WE CARE';

function myFunction() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

function doGet() {
  return jsonResponse({ success: true, message: 'SMP web app is running.' });
}

function doPost(e) {
  try {
    console.log('[doPost] START');
    const payload = getPayload_(e);
    console.log('[doPost] formType=' + (payload.formType || 'quote'));
    const formType = payload.formType === 'contractor' ? 'contractor' : 'quote';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw new Error('Open this Apps Script from the target Google Sheet before deploying the web app.');
    }

    if (formType === 'quote') {
      saveQuote_(spreadsheet, payload);
      console.log('[doPost] sheet write PASS');
      sendQuoteEmail_(payload);
      console.log('[doPost] email PASS');
    } else {
      saveContractor_(spreadsheet, payload);
      console.log('[doPost] sheet write PASS');
      sendContractorEmail_(payload);
      console.log('[doPost] email PASS');
    }

    console.log('[doPost] END — success');
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('[doPost] FAIL: ' + error.message);
    return jsonResponse({ success: false, message: error.message });
  }
}

function savePhotoToDrive_(payload) {
  if (!payload.photoBase64) return '';

  var folder;
  var folders = DriveApp.getFoldersByName('SMP Quote Photos');
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder('SMP Quote Photos');
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  var blob = Utilities.newBlob(
    Utilities.base64Decode(payload.photoBase64),
    payload.photoMime || 'image/jpeg',
    payload.photoName || 'photo.jpg'
  );

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function saveQuote_(spreadsheet, payload) {
  var photoLink = savePhotoToDrive_(payload);

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
    photoLink || payload.photoLink || ''
  ];

  appendRow_(spreadsheet, QUOTE_SHEET_NAME, headers, row);

  payload.photoLink = photoLink;
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

function sendViaBrevo_(to, replyTo, subject, textContent) {
  console.log('[sendViaBrevo_] to=' + to + ', subject=' + subject);
  console.log('[sendViaBrevo_] API key present: ' + (BREVO_API_KEY ? 'YES (length ' + BREVO_API_KEY.length + ')' : 'NO — MISSING!'));

  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not set. Go to Project Settings → Script Properties and add it.');
  }

  var emailPayload = {
    sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
    to: [{ email: to }],
    replyTo: { email: replyTo || to },
    subject: subject,
    textContent: textContent
  };

  console.log('[sendViaBrevo_] Calling Brevo API...');
  var response = UrlFetchApp.fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'api-key': BREVO_API_KEY },
    payload: JSON.stringify(emailPayload),
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();
  var body = response.getContentText();
  console.log('[sendViaBrevo_] HTTP ' + code + ': ' + body);

  if (code < 200 || code >= 300) {
    console.error('[sendViaBrevo_] FAIL — Brevo returned HTTP ' + code + ': ' + body);
    throw new Error('Email send failed (Brevo ' + code + '): ' + body);
  }

  console.log('[sendViaBrevo_] PASS');
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

  sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body);
}

function sendContractorEmail_(payload) {
  const subject = 'New SMP contractor registration';
  const body = [
    'A new contractor registration was submitted.',
    '',
    'Name: ' + (payload.name || ''),
    'Phone: ' + (payload.phone || ''),
    'Email: ' + (payload.email || ''),
    'Area: ' + (payload.area || ''),
    'Service: ' + (payload.service || ''),
    'Experience: ' + (payload.experience || '') + ' years',
    'Notes: ' + (payload.notes || '')
  ].join('\n');

  sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body);
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
