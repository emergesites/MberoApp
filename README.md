# SmP – WE CARE

Static website for **SmP – WE CARE**, a construction, maintenance and property improvement company serving public and private sector clients in South Africa.

**Live features:** hero slideshow, service gallery with filters, "Our Work" before/after carousel, quote request form (with photo upload), contractor registration form, WhatsApp integration, Brevo email notifications.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Quick Start (Local)](#quick-start-local)
3. [Hosting / Deployment](#hosting--deployment)
4. [Google Apps Script Setup](#google-apps-script-setup)
5. [Brevo Email Setup](#brevo-email-setup)
6. [Configuration Reference](#configuration-reference)
7. [Content Updates](#content-updates)
8. [Form Validation](#form-validation)
9. [Troubleshooting](#troubleshooting)
10. [Client Handover Checklist](#client-handover-checklist)

---

## Project Structure

```
index.html              Main site (hero, about, gallery, carousel, quote form, contact)
contractor.html         Contractor registration page
app.js                  All client-side logic (slideshow, gallery, carousel, forms, validation)
google-apps-script.gs   Server-side code (paste into Google Apps Script editor)
CLIENT-GUIDE.md         Non-technical guide for the site owner
img/
  Logo.jpeg             Favicon + header logo
  SlideShow/            Hero slideshow images
  BeforeAfterGrass/     Landscaping before/after photos
  BeforeAfterPipe/      Plumbing before/after photos
```

No build step. No framework. HTML + Tailwind CSS (CDN) + vanilla JS + Glide.js (CDN).

---

## Quick Start (Local)

```bash
# Any static server works
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

---

## Hosting / Deployment

This is a **static site** — no server or build step required. Upload all files as-is to any host:

| Host | Cost | How |
|------|------|-----|
| **GitHub Pages** | Free | Repo Settings → Pages → Deploy from `main` |
| **Netlify** | Free tier | Drag-and-drop the project folder, or connect the GitHub repo |
| **Vercel** | Free tier | Import the GitHub repo |
| **Cloudflare Pages** | Free tier | Connect the GitHub repo |
| **Any web host** | Varies | Upload all files via FTP/SFTP |

After deploying, the site is ready — no environment variables or server config needed on the hosting side.

---

## Google Apps Script Setup

The forms submit data to a **Google Apps Script** web app that saves submissions to a Google Sheet and sends email notifications via Brevo.

### First-time setup

1. Create a new Google Sheet (or use the existing one).
2. Open **Extensions → Apps Script**.
3. Delete any default code and paste the entire contents of `google-apps-script.gs`.
4. Set up the Brevo API key (see [Brevo Email Setup](#brevo-email-setup) below).
5. Click **Deploy → New deployment**.
6. Set:
   - **Type:** Web app
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy** and authorize the permissions when prompted.
8. Copy the **Web app URL** and paste it into `app.js` as the `GOOGLE_APPS_SCRIPT_URL` value.

### Redeploying after code changes

Every time you edit the `.gs` code:

1. Click **Deploy → Manage deployments → Edit** (pencil icon).
2. Under **Version**, select **New version**.
3. Click **Deploy**.

> If you only click "Save" without redeploying, the live web app still runs the old code.

### Sheet structure

Two sheet tabs are auto-created on first submission:

| Tab | Columns |
|-----|---------|
| **Quote Requests** | Submitted At, Name, Phone, Email, Service, Location, Preferred Date, Details, Photo Link |
| **Contractor Registrations** | Submitted At, Name, Phone, Email, Area, Service, Experience, Notes |

---

## Brevo Email Setup

Email notifications are sent via the [Brevo](https://www.brevo.com) transactional email API.

### 1. Create a Brevo account

Sign up at [brevo.com](https://www.brevo.com) and verify your sender email address.

### 2. Generate an API key

Go to **Settings → SMTP & API → API keys & MCP** → Generate a new API key. Copy it.

### 3. Store the key in Apps Script

1. In the Apps Script editor, go to **Project Settings** (gear icon).
2. Scroll to **Script Properties**.
3. Add a property:
   - **Property:** `BREVO_API_KEY`
   - **Value:** *(paste your API key)*
4. Click **Save**.

> Never hardcode the API key in the `.gs` file — Script Properties keeps it secure and out of source control.

### 4. Disable IP restriction (important)

Google Apps Script makes API calls from Google's IP ranges, which rotate frequently. Brevo's IP restriction will block these calls.

1. In Brevo, go to **Settings → Security → Authorized IPs**.
2. Make sure **API keys** blocking is set to **Deactivated**.

### Current email configuration

| Setting | Value |
|---------|-------|
| Notification recipient | `smpwecare@gmail.com` |
| Sender email (must be verified in Brevo) | `emergesites@gmail.com` |
| Sender name | SmP – WE CARE |

To change the notification email, edit `NOTIFICATION_EMAIL` in `google-apps-script.gs` and redeploy.

---

## Configuration Reference

All configurable values and where to find them:

| What | Where | Current value |
|------|-------|---------------|
| Apps Script endpoint | `app.js` line 1 (`GOOGLE_APPS_SCRIPT_URL`) | `https://script.google.com/macros/s/AKfycb.../exec` |
| Notification email | `google-apps-script.gs` line 3 | `smpwecare@gmail.com` |
| Brevo sender email | `google-apps-script.gs` line 7 | `emergesites@gmail.com` |
| Brevo API key | Apps Script → Project Settings → Script Properties | *(stored securely)* |
| WhatsApp number | `index.html` and `contractor.html` (search `wa.me/`) | `+27 64 232 3431` |
| Phone number | `index.html` contact section | `081 467 3054` |
| Company email | `index.html` contact section | `smpwecare@gmail.com` |
| Max photo upload size | `app.js` (`MAX_PHOTO_SIZE`) | 5 MB |

---

## Content Updates

### Hero slideshow

Edit the `heroSlides` array in `app.js`:

```js
{
  image: "img/SlideShow/filename.jpeg",
  service: "Service Name",
  title: "Heading text.",
  description: "Subheading text.",
}
```

Add the image file to `img/SlideShow/`.

### Gallery images

Edit the `galleryImages` array in `app.js`:

```js
{
  image: "SubFolder/filename.jpeg",
  title: "Title",
  description: "Description",
  service: "Landscaping"   // Landscaping | Plumbing | Electrical | Renovations | Construction
}
```

Add the image file to the appropriate `img/` subfolder.

### "Our Work" before/after carousel

Edit the `ourWorkProjects` array in `app.js`:

```js
{
  before: "img/BeforeAfterGrass/Before.jpeg",
  after: "img/BeforeAfterGrass/After.jpeg",
  service: "Grounds & Maintenance",
  title: "Project description",
}
```

### Services in quote form dropdown

Edit the `<select>` element in `index.html` (search for `id="quote-service"`).

### WhatsApp number

Search and replace `wa.me/27642323431` in both `index.html` and `contractor.html`. Format: `wa.me/27XXXXXXXXX` (no spaces, no `+`).

---

## Form Validation

Both forms validate before submission:

- **Phone:** South African format — `0XX XXX XXXX` or `+27XXXXXXXXX`
- **Email:** Standard email format check
- **Required fields:** All fields marked `required` must be filled

Error messages appear in red below the submit button and auto-focus the invalid field.

Success messages auto-hide after 5 seconds.

---

## Troubleshooting

### Forms show "success" but nothing appears in the Google Sheet

- **Most common:** You edited the Apps Script but didn't redeploy as a **New version**. See [Redeploying after code changes](#redeploying-after-code-changes).
- Check that **Who has access** is set to **Anyone** (not "Only myself").
- Open the Apps Script **Executions** tab (clock icon) to see if the function ran.

### Sheet writes work but no email is received

1. Check the **Executions** tab — click a `doPost` entry and expand the logs. Look for `[sendViaBrevo_]` lines.
2. Common errors:
   - `API key present: NO` → Add `BREVO_API_KEY` to Script Properties.
   - `HTTP 401` → API key is wrong or expired. Generate a new one in Brevo.
   - `HTTP 403` → IP restriction is active. Disable it in Brevo → Security → Authorized IPs.
   - `HTTP 400` → Sender email not verified in Brevo.
3. Make sure the sender email (`emergesites@gmail.com`) is verified in Brevo under **Settings → Senders, domains, IPs**.

### Photo upload fails

- File must be under 5 MB (JPG, PNG, or WEBP).
- The Apps Script needs Google Drive authorization — if it's a first-time deploy, the authorization prompt should appear. If it was dismissed, go to Apps Script → Run `doPost` manually → Authorize.

### Hamburger menu doesn't toggle on mobile

- Make sure `app.js` is loaded (check browser console for errors).
- The menu toggle targets the element IDs `menu-toggle`, `nav-links`, `menu-icon-open`, `menu-icon-close` — verify these exist in the HTML.

---

## Client Handover Checklist

Use this checklist when transferring the project to a client or new developer:

### Accounts to transfer / share access

- [ ] **GitHub repo** — Transfer ownership or add collaborator: `github.com/okuhlechar-glitch/MberoApp`
- [ ] **Google Sheet** — Share editor access to the sheet that receives form submissions
- [ ] **Google Apps Script** — Accessible via the Google Sheet (Extensions → Apps Script)
- [ ] **Brevo account** — Transfer ownership or share login for `emergesites@gmail.com`
- [ ] **Hosting account** — Transfer whichever hosting platform is used (GitHub Pages, Netlify, etc.)
- [ ] **Domain** (if applicable) — Transfer domain registrar access and update DNS

### Credentials the client needs

- [ ] Brevo API key (stored in Apps Script Script Properties, not in code)
- [ ] Google account that owns the Sheet + Apps Script deployment
- [ ] Hosting platform login

### Verify before handover

- [ ] Submit a test quote form → check it appears in the Google Sheet
- [ ] Submit a test contractor form → check it appears in the Google Sheet
- [ ] Verify email notification is received at `smpwecare@gmail.com`
- [ ] Test photo upload (< 5 MB image) → check Google Drive folder "SMP Quote Photos"
- [ ] Test on mobile device (hamburger menu, carousel swipe, form submission)
- [ ] Verify WhatsApp link opens correct number
- [ ] Verify phone/email links in contact section work

### Documentation provided

- [ ] This `README.md` (developer reference)
- [ ] `CLIENT-GUIDE.md` (non-technical guide for the site owner)

---

## Tech Stack

- **HTML/CSS:** Tailwind CSS v3 via CDN
- **JS:** Vanilla ES2020+, no build step
- **Carousel:** [Glide.js](https://glidejs.com) v3.6 via CDN
- **Backend:** Google Apps Script (serverless)
- **Database:** Google Sheets
- **Email:** Brevo transactional email API
- **File storage:** Google Drive (for photo uploads)
