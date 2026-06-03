# SmP – WE CARE — Site Owner Guide

This guide is for the **site owner** (non-technical). For developer documentation, see `README.md`.

---

## Your Website Pages

| Page | What it does |
|------|-------------|
| **Home page** (`index.html`) | Hero slideshow, About, Gallery, "Our Work" carousel, Quote form, Contact |
| **Contractor page** (`contractor.html`) | Registration form for contractors who want to work with SmP |

---

## Where Form Submissions Go

All submissions are saved to your **Google Sheet** in two tabs:

- **Quote Requests** — customer quote submissions from the home page
- **Contractor Registrations** — contractor sign-ups from the contractor page

Each submission also sends an **email notification** to `smpwecare@gmail.com`.

### Quote Request columns

Submitted At | Name | Phone | Email | Service | Location | Preferred Date | Details | Photo Link

### Contractor Registration columns

Submitted At | Name | Phone | Email | Area | Service | Experience | Notes

---

## If Forms Stop Working

This is almost always because the Apps Script needs to be **redeployed**:

1. Open your Google Sheet → **Extensions** → **Apps Script**
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil/edit icon**
4. Make sure:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Under **Version**, select **New version**
6. Click **Deploy**

> Every time the code is changed, you must select "New version" and redeploy. Just clicking "Save" is not enough.

---

## If Emails Stop Arriving

1. Open the Apps Script editor → click the **clock icon** (Executions) in the left sidebar
2. Look for the most recent `doPost` entry and click to expand it
3. Look for lines starting with `[sendViaBrevo_]` — they'll tell you the exact error
4. Common fixes:
   - **"API key present: NO"** → Go to Project Settings → Script Properties → add `BREVO_API_KEY`
   - **"HTTP 401"** → The API key is wrong or expired. Generate a new one in Brevo
   - **"HTTP 403"** → IP restriction is active. Go to Brevo → Settings → Security → Authorized IPs → make sure API key blocking is **Deactivated**

---

## Changing Contact Details

### Notification email (where form submissions are sent)

1. Open Apps Script (Google Sheet → Extensions → Apps Script)
2. Change this line near the top:
   ```
   const NOTIFICATION_EMAIL = 'smpwecare@gmail.com';
   ```
3. Save and **redeploy as new version**

### WhatsApp number

1. Open `index.html` and `contractor.html`
2. Search for `https://wa.me/27810248983`
3. Replace with your new number: `https://wa.me/27810248983` (no spaces, no `+`)

### Phone number

Search for `0810248983` in `index.html` and replace it.

### Email address (displayed on site)

Search for `smpwecare@gmail.com` in `index.html` and replace it.

---

## Adding Project Photos

### Gallery photos

1. Save the image as `.jpeg` in the `img/` folder
2. Ask your developer to add it to the `galleryImages` list in `app.js`
3. Categories: Landscaping, Plumbing, Electrical, Renovations, Construction

### "Our Work" before/after cards

1. Save the before and after images in `img/`
2. Ask your developer to add them to the `ourWorkProjects` list in `app.js`

### Hero slideshow

1. Save the image in `img/SlideShow/`
2. Ask your developer to add it to the `heroSlides` list in `app.js`

---

## Hosting

This is a static website — no server required. It can be hosted on:

- **GitHub Pages** (free) — Enable in repo Settings → Pages
- **Netlify** (free) — Drag and drop the project folder
- **Vercel** (free) — Import the GitHub repo
- **Any web host** — Upload all files via FTP

No build step needed. Upload the files as they are.

---

## Accounts You Need Access To

| Account | What it's for | How to access |
|---------|--------------|---------------|
| **GitHub** | Source code | `github.com/okuhlechar-glitch/MberoApp` |
| **Google Sheet** | Form submissions database | Shared via Google account |
| **Google Apps Script** | Server-side form processing | Open from the Google Sheet (Extensions → Apps Script) |
| **Brevo** | Email notifications | `brevo.com` — login with the account that has the API key |
| **Hosting platform** | Where the site is live | Depends on chosen host (GitHub Pages, Netlify, etc.) |

---

## Quick Reference

| Item | Value |
|------|-------|
| Company name | SmP – WE CARE |
| Phone | 0810248983 |
| WhatsApp | +27 81 024 8983 |
| Email | smpwecare@gmail.com |
| Notification email | smpwecare@gmail.com |
| Brevo sender | emergesites@gmail.com |
| Max photo upload | 5 MB (JPG, PNG, WEBP) |
