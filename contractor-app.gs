// Contractor handler: saves registrations and notifies via Brevo

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
