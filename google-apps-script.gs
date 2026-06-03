// Shared helpers for SMP Apps Script project

const SCRIPT_VERSION = '2026-06-02-v8';
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

function getPayload_(e) {
  const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
  const contentType = e && e.postData && e.postData.type ? e.postData.type : '';

  if (rawBody) {
    console.log('[getPayload_] Raw body length: ' + rawBody.length);
    console.log('[getPayload_] Content type: ' + contentType);

    try {
      var parsed = JSON.parse(rawBody);
      console.log('[getPayload_] Parsed as JSON');
      return parsed;
    } catch (_) {
      // Not JSON — try URL-encoded
    }

    if (rawBody.indexOf('=') !== -1) {
      console.log('[getPayload_] Parsed as URL-encoded');
      return parseUrlEncodedBody_(rawBody);
    }

    throw new Error('Unable to parse request body: ' + rawBody.substring(0, 200));
  }

  return e && e.parameter ? e.parameter : {};
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

function sendViaBrevo_(to, replyTo, subject, textContent, attachments) {
  console.log('[sendViaBrevo_] to=' + to + ', subject=' + subject);
  var BREVO_API_KEY = getBrevoApiKey_();
  var BREVO_SENDER_EMAIL = 'emergesites@gmail.com';
  var BREVO_SENDER_NAME = 'SmP – WE CARE';

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

  if (attachments && attachments.length) {
    emailPayload.attachment = attachments; // { content: base64, name: string, contentType: string }
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
  var payload = { name: 'Test', email: NOTIFICATION_EMAIL, details: 'Brevo test' };
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

function testSendContractor() {
  var payload = {
    name: 'Test Contractor',
    phone: '082 555 1234',
    email: NOTIFICATION_EMAIL,
    area: 'Pretoria',
    service: 'Plumbing',
    experience: '5',
    notes: 'This is a test contractor registration from the editor.'
  };
  return handleContractorRegistration(null, SpreadsheetApp.getActiveSpreadsheet(), payload);
}

function doPost(e) {
  try {
    console.log('[doPost] START — version ' + SCRIPT_VERSION);
    console.log('[doPost] postData.type=' + (e && e.postData && e.postData.type));
    console.log('[doPost] postData.length=' + (e && e.postData && e.postData.length));
    const payload = getPayload_(e);
    console.log('[doPost] payload keys: ' + Object.keys(payload).join(', '));
    console.log('[doPost] formType=' + (payload.formType || 'quote'));
    const formType = payload.formType === 'contractor' ? 'contractor' : 'quote';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) throw new Error('Open this Apps Script from the target Google Sheet before deploying the web app.');

    if (formType === 'contractor') return handleContractorRegistration(e, spreadsheet, payload);
    return handleQuoteRequest(e, spreadsheet, payload);
  } catch (err) {
    console.error('[doPost] FAIL: ' + err.message + '\n' + err.stack);
    return jsonResponse({ success: false, message: err.message, version: SCRIPT_VERSION });
  }
}
