// Shared helpers for SMP Apps Script project

const QUOTE_SHEET_NAME = 'Quote Requests';
const CONTRACTOR_SHEET_NAME = 'Contractor Registrations';
const NOTIFICATION_EMAIL = 'smpwecare@gmail.com';

function myFunction() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

function doGet() {
  return jsonResponse({ success: true, message: 'SMP web app is running.' });
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
    try {
      if (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/json') !== -1) {
        return JSON.parse(rawBody);
      }

      if (rawBody.indexOf('=') !== -1) {
        return parseUrlEncodedBody_(rawBody);
      }

      return JSON.parse(rawBody);
    } catch (err) {
      throw new Error('Unable to parse request body: ' + err.message + '\nbody=' + rawBody);
    }
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
  var BREVO_API_KEY = getBrevoApiKey_();
  var BREVO_SENDER_EMAIL = 'emergesites@gmail.com';
  var BREVO_SENDER_NAME = 'SmP – WE CARE';

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
  if (code < 200 || code >= 300) {
    throw new Error('Brevo send failed (HTTP ' + code + '): ' + body);
  }
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
    name: 'Tester',
    email: NOTIFICATION_EMAIL,
    details: 'Quote test',
    photoBase64: ''
  };
  return handleQuoteRequest(null, SpreadsheetApp.getActiveSpreadsheet(), payload);
}

function doPost(e) {
  try {
    console.log('[doPost] START');
    const payload = getPayload_(e);
    console.log('[doPost] payload=' + JSON.stringify(payload));
    const formType = payload.formType === 'contractor' ? 'contractor' : 'quote';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) throw new Error('Open this Apps Script from the target Google Sheet before deploying the web app.');

    if (formType === 'contractor') return handleContractorRegistration(e, spreadsheet, payload);
    return handleQuoteRequest(e, spreadsheet, payload);
  } catch (err) {
    console.error('[doPost] FAIL: ' + err.message);
    return jsonResponse({ success: false, message: err.message });
  }
}
