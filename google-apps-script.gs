// Shared helpers for SMP Apps Script project

const SCRIPT_VERSION = '2026-06-03-v9';
const QUOTE_SHEET_NAME = 'Quote Requests';
const CONTRACTOR_SHEET_NAME = 'Contractor Registrations';
const NOTIFICATION_EMAIL = 'smpwecare@gmail.com';

function myFunction() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

function doGet() {
  return jsonResponse({ success: true, message: 'SMP web app is running.', version: SCRIPT_VERSION });
}

function getBrevoApiKey_() {
  return PropertiesService.getScriptProperties().getProperty('BREVO_API_KEY');
}

function parseUrlEncodedBody_(rawBody) {
  var result = {};
  rawBody.split('&').forEach(function(pair) {
    if (!pair) return;
    var parts = pair.split('=');
    var key = decodeURIComponent(parts[0].replace(/\+/g, ' '));
    var value = parts.length > 1 ? decodeURIComponent(parts.slice(1).join('=').replace(/\+/g, ' ')) : '';
    result[key] = value;
  });
  return result;
}

// Robust extractor that cleanly handles Data URLs (data:image/jpeg;base64,...)
function extractBase64AndMime_(payload) {
  var base64Data = payload.photoBase64 || '';
  var mimeType = payload.photoMime || 'image/jpeg';
  
  if (base64Data.indexOf(';base64,') !== -1) {
    var parts = base64Data.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }
  
  return {
    base64: base64Data,
    mime: mimeType
  };
}

function getPayload_(e) {
  if (!e) return {};
  
  const parameter = e.parameter || {};
  const rawBody = e.postData && e.postData.contents ? e.postData.contents : '';
  const contentType = e.postData && e.postData.type ? e.postData.type : '';

  if (rawBody) {
    console.log('[getPayload_] Raw body length: ' + rawBody.length);
    console.log('[getPayload_] Content type: ' + contentType);

    // 1. Try pure JSON parsing
    try {
      var parsed = JSON.parse(rawBody);
      console.log('[getPayload_] Parsed successfully as JSON');
      return parsed;
    } catch (_) {
      // Not JSON — continue
    }

    // 2. Try URL-encoded processing (only if type matches or safely verified)
    if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
      console.log('[getPayload_] Parsed as URL-encoded');
      return parseUrlEncodedBody_(rawBody);
    }
    
    // 3. Fallback safely if dealing with multi-part forms (avoids parsing destruction)
    if (contentType.indexOf('multipart/form-data') !== -1) {
      console.log('[getPayload_] Form-data detected, routing to parameters');
      return parameter;
    }

    if (rawBody.indexOf('=') !== -1 && rawBody.indexOf('&') !== -1) {
      return parseUrlEncodedBody_(rawBody);
    }
  }

  console.log('[getPayload_] Defaulting to standard request parameters');
  return Object.keys(parameter).length > 0 ? parameter : {};
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendRow_(spreadsheet, sheetName, headers, row) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  sheet.appendRow(row);
}

// Persistent logger that records incoming web app requests safely
function writeExecutionLog_(level, message, meta) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return; 

    var sheetName = 'Execution Logs';
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Timestamp', 'Level', 'Message', 'Meta']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    var metaText = '';
    try {
      metaText = meta ? (typeof meta === 'string' ? meta : JSON.stringify(meta)) : '';
    } catch (e) {
      metaText = String(meta).substring(0, 1000);
    }

    if (metaText && metaText.length > 2000) metaText = metaText.substring(0, 2000) + '...';

    sheet.appendRow([new Date().toISOString(), level || 'INFO', message || '', metaText]);
  } catch (err) {
    try { Logger.log('[writeExecutionLog_] fail: ' + err.message); } catch (e) {}
  }
}

function sendViaBrevo_(to, replyTo, subject, textContent, attachments) {
  console.log('[sendViaBrevo_] to=' + to + ', subject=' + subject);
  var BREVO_API_KEY = getBrevoApiKey_();
  var BREVO_SENDER_EMAIL = NOTIFICATION_EMAIL; // Fixed to target the new updated email address
  var BREVO_SENDER_NAME = 'SmP – WE CARE';

  console.log('[sendViaBrevo_] API key present: ' + (BREVO_API_KEY ? 'YES' : 'NO — MISSING!'));
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

  if (attachments && attachments.length) {
    emailPayload.attachment = attachments; 
  }

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
    throw new Error('Brevo send failed (HTTP ' + code + '): ' + body);
  }
  console.log('[sendViaBrevo_] PASS');
}

// Manual test helpers
function testSendBrevo() {
  try {
    sendViaBrevo_(NOTIFICATION_EMAIL, NOTIFICATION_EMAIL, 'Test Brevo', 'This is a test from Apps Script', []);
    console.log('testSendBrevo: success');
  } catch (err) {
    console.error('testSendBrevo: fail - ' + err.message);
    throw err;
  }
}

function testSendQuote() {
  var payload = {
    name: 'Test User',
    phone: '081 467 3054',
    email: NOTIFICATION_EMAIL,
    service: 'Landscaping',
    location: 'Johannesburg',
    preferredDate: '2026-07-01',
    details: 'This is a test quote request from the editor.',
    photoBase64: ''
  };
  return handleQuoteRequest(null, SpreadsheetApp.getActiveSpreadsheet(), payload);
}

function doPost(e) {
  try {
    console.log('[doPost] START — version ' + SCRIPT_VERSION);
    
    const payload = getPayload_(e);
    
    // Log parsed keys directly to your Google Sheet to inspect data structure variations
    try {
      writeExecutionLog_('INFO', '[doPost] Data Received', {
        keysFound: Object.keys(payload),
        hasPhoto: !!payload.photoBase64,
        sampleData: JSON.stringify(payload).substring(0, 400)
      });
    } catch (err) { /* ignore */ }

    const formType = payload.formType === 'contractor' ? 'contractor' : 'quote';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) throw new Error('Open this Apps Script from the target Google Sheet before deploying.');

    if (formType === 'contractor') return handleContractorRegistration(e, spreadsheet, payload);
    return handleQuoteRequest(e, spreadsheet, payload);
  } catch (err) {
    console.error('[doPost] FAIL: ' + err.message);
    try { writeExecutionLog_('ERROR', '[doPost] FAIL', { message: err.message, stack: err.stack }); } catch (e) {}
    return jsonResponse({ success: false, message: err.message, version: SCRIPT_VERSION });
  }
}

function handleContractorRegistration(e, spreadsheet, payload) {
  try {
    console.log('[handleContractorRegistration] START');

    const headers = [
      'Submitted At', 'Name', 'Phone', 'Email', 'Area', 'Service', 'Experience', 'Notes'
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

    sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body, []);

    console.log('[handleContractorRegistration] DONE');
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('[handleContractorRegistration] FAIL: ' + err.message);
    return jsonResponse({ success: false, message: err.message });
  }
}

function handleQuoteRequest(e, spreadsheet, payload) {
  try {
    console.log('[handleQuoteRequest] START');

    // Clean data components out of the Base64 string if present
    if (payload.photoBase64) {
      var cleanedImg = extractBase64AndMime_(payload);
      payload.photoBase64 = cleanedImg.base64;
      payload.photoMime = cleanedImg.mime;
    }

    // Save photo to Drive (if present)
    var photoLink = '';
    if (payload.photoBase64) {
      photoLink = savePhotoToDrive_(payload);
      payload.photoLink = photoLink;
    }

    const headers = [
      'Submitted At', 'Name', 'Phone', 'Email', 'Service', 'Location', 'Preferred Date', 'Details', 'Photo Link'
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
      'Photo Link: ' + (photoLink || payload.photoLink || 'None provided')
    ].join('\n');

    if (payload.photoBase64) {
      var attachments = [{ 
        content: payload.photoBase64, 
        name: payload.photoName || 'photo.jpg', 
        contentType: payload.photoMime || 'image/jpeg' 
      }];
      try {
        sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body, attachments);
        console.log('[handleQuoteRequest] Email sent via Brevo with attachment');
      } catch (err) {
        console.error('[handleQuoteRequest] Brevo failed, using fallback GmailApp: ' + err.message);
        var blob = Utilities.newBlob(Utilities.base64Decode(payload.photoBase64), payload.photoMime || 'image/jpeg', payload.photoName || 'photo.jpg');
        GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, { replyTo: payload.email || NOTIFICATION_EMAIL, attachments: [blob] });
      }
    } else {
      sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body, []);
    }

    console.log('[handleQuoteRequest] DONE');
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('[handleQuoteRequest] FAIL: ' + err.message);
    try { writeExecutionLog_('ERROR', '[handleQuoteRequest] Exception', { error: err.message }); } catch(e){}
    return jsonResponse({ success: false, message: err.message });
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