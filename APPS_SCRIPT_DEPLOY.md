# Deployment & Testing — SMP Apps Script Web App

## File Structure

The Apps Script project uses **3 separate `.gs` files**. In the Apps Script editor you must have one file per module. The **file names in Apps Script do NOT need to match** the repo file names — you can name them anything (e.g. `Code.gs`, `ContractorApp.gs`, `QuoteApp.gs`). What matters is that each file contains the correct code.

| Repo file              | Suggested Apps Script name | Contains                                              |
|------------------------|---------------------------|-------------------------------------------------------|
| `google-apps-script.gs`| `Code.gs` (default)       | Shared helpers, constants, `doGet`, `doPost`, tests   |
| `contractor-app.gs`    | `ContractorApp.gs`        | `handleContractorRegistration()`                      |
| `quote-app.gs`         | `QuoteApp.gs`             | `handleQuoteRequest()`, `savePhotoToDrive_()`         |

> **Important:** All `.gs` files in an Apps Script project share the same global scope. Functions and constants defined in one file are accessible from all other files. This is why the split works — `doPost` in `Code.gs` can call `handleContractorRegistration()` from `ContractorApp.gs`.

## 1) Set Up Files in Apps Script

1. Open the Apps Script project (Extensions → Apps Script from your Google Sheet).
2. You should already have `Code.gs`. Paste the contents of `google-apps-script.gs` into it.
3. Click the **+** next to "Files" → **Script** → name it `ContractorApp` → paste the contents of `contractor-app.gs`.
4. Click **+** → **Script** → name it `QuoteApp` → paste the contents of `quote-app.gs`.
5. **Delete** any unused files (e.g. `Untitled.gs`) — they may contain old conflicting code.

## 2) Set Script Properties

1. In Apps Script → **Project Settings** (gear icon, left sidebar).
2. Scroll to **Script Properties**.
3. Add: Property = `BREVO_API_KEY`, Value = your Brevo API key.

## 3) Deploy (or Update) the Web App

### First-time deployment:
- **Deploy** → **New deployment** → Select **Web app**.
- Execute as: **Me**
- Who has access: **Anyone**
- Click **Deploy** and copy the Web app URL.
- Paste this URL into `app.js` as the `GOOGLE_APPS_SCRIPT_URL` constant.

### Updating after code changes:
- **Deploy** → **Manage deployments** → click the **pencil icon** (Edit).
- Change Version to: **New version**.
- Click **Deploy**.
- The URL stays the same — no need to update `app.js`.

> ⚠️ **Just saving the code does NOT update the live web app.** You MUST deploy a new version every time you change the code.

## 4) Verify Deployment

Visit your deployed URL in a browser (the `/exec` URL). You should see:
```json
{"success":true,"message":"SMP web app is running.","version":"2026-06-02-v8"}
```
If the version doesn't match, you haven't deployed the latest code yet.

## 5) Authorize Scopes

On first run you'll be prompted to authorize access to Sheets, Drive, and Gmail. Approve the requests.

## 6) Test Helpers

In the Apps Script editor, select a function from the dropdown and click **Run**:

| Function               | What it tests                                     |
|------------------------|--------------------------------------------------|
| `testSendBrevo`        | Brevo API connection only                         |
| `testSendQuote`        | Full quote flow: sheet write + email with data    |
| `testSendContractor`   | Full contractor flow: sheet write + email with data|

Check **Executions** (clock icon in left sidebar) → click a row → expand to see logs.

## 7) Frontend POST Examples

### Quote with photo (JSON):
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

### Contractor (JSON):
```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formType: 'contractor',
    name: 'Bob',
    email: 'bob@example.com',
    phone: '081 234 5678',
    area: 'Nairobi',
    service: 'plumbing',
    experience: '5',
    notes: 'Has tools'
  })
});
```

## 8) Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Form shows "success" but nothing in sheet | Stale deployment | Deploy → Manage deployments → Edit → **New version** → Deploy |
| Email not sent but sheet updated | `BREVO_API_KEY` missing or wrong | Check Script Properties |
| Brevo returns 403 | IP restriction enabled | Brevo → Settings → Security → Deactivate IP restriction for API keys |
| Version in browser doesn't match code | Didn't deploy new version | Redeploy (see step 3) |
| `Untitled.gs` errors | Leftover file with old code | Delete the `Untitled.gs` file |

## Notes

- Quote emails prefer Brevo (attachments sent as base64). If Brevo fails, the script falls back to `GmailApp.sendEmail` with a blob attachment.
- Contractor notifications use Brevo only.
- The function dropdown in the editor (where it says "doPost" or "testSendBrevo") is **only for manual testing** — it does NOT affect the deployed web app. The web app always calls `doPost(e)` regardless of what's selected.
