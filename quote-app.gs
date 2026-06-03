// Quote handler: saves quote requests and handles images, sends email with attachment

function handleQuoteRequest(e, spreadsheet, payload) {
  try {
    console.log('[handleQuoteRequest] START');

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

    // Send email with attachment when photo included
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

    if (payload.photoBase64) {
      // Prefer Brevo (supports base64 attachments). If it fails, fall back to GmailApp with blob attachment.
      var attachments = [{ content: payload.photoBase64, name: payload.photoName || 'photo.jpg', contentType: payload.photoMime || 'image/jpeg' }];
      try {
        sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body, attachments);
        console.log('[handleQuoteRequest] Email sent via Brevo with attachment');
      } catch (err) {
        console.error('[handleQuoteRequest] Brevo send failed: ' + err.message + ' — falling back to GmailApp');
        var blob = Utilities.newBlob(Utilities.base64Decode(payload.photoBase64), payload.photoMime || 'image/jpeg', payload.photoName || 'photo.jpg');
        GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, { replyTo: payload.email || NOTIFICATION_EMAIL, attachments: [blob] });
        console.log('[handleQuoteRequest] Email sent via GmailApp with attachment (fallback)');
      }
    } else {
      // No attachment — use Brevo
      sendViaBrevo_(NOTIFICATION_EMAIL, payload.email, subject, body, []);
    }

    console.log('[handleQuoteRequest] DONE');
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('[handleQuoteRequest] FAIL: ' + err.message);
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
