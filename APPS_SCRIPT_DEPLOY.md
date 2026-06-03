Deployment & testing for SMP Apps Script web app

1) Set Script Properties
- Open the Apps Script project (Extensions → Apps Script) from the target Google Sheet.
- In Project Settings → Script Properties add `BREVO_API_KEY` = <your brevo api key>.

2) Deploy the web app
- In Apps Script editor: Deploy → New deployment → Select "Web app".
- Execute as: Me
- Who has access: Anyone (or Anyone with link) depending on needs.
- Click Deploy and copy the Web app URL.

3) Authorize scopes
- On first run you'll be prompted to authorize access to Sheets, Drive, and Gmail (if used). Approve the requests.

4) Frontend POST examples
- Quote with photo (JSON):

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formType: 'quote',
    name: 'Jane',
    email: 'jane@example.com',
    phone: '012345',
    service: 'lawn',
    details: 'Please quote',
    photoBase64: '<BASE64_PAYLOAD_HERE>',
    photoMime: 'image/jpeg',
    photoName: 'front-yard.jpg'
  })
});
```

- Contractor (JSON):

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formType: 'contractor',
    name: 'Bob',
    email: 'bob@example.com',
    area: 'Nairobi',
    service: 'plumbing',
    experience: '5',
    notes: 'Has tools'
  })
});
```

5) Notes
- Quote emails prefer Brevo (attachments sent as base64). If Brevo fails, the script falls back to `GmailApp.sendEmail` with a blob attachment.
- Contractor notifications use Brevo.
- Make sure the script is opened from the target Google Sheet so `SpreadsheetApp.getActiveSpreadsheet()` returns the right sheet, or modify code to open by ID.

6) Testing helpers
- In the Apps Script editor you can run `testSendBrevo()` and `testSendQuote()` to exercise sending logic (they will prompt for authorization if needed).