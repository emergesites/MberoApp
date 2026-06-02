# SMP Landscaping & Construction Services — Client Guide

This guide explains how to manage and update your SMP website.

---

## Your Website Pages

| Page | What it does |
|------|-------------|
| **Home page** (`index.html`) | Hero slideshow, About section, Gallery, Quote request form, Contact info |
| **Contractor page** (`contractor.html`) | Registration form for contractors who want to work with SMP |

---

## Google Sheets — Where Submissions Go

All form submissions are saved to your Google Sheet in two tabs:

- **Quote Requests** — When a customer submits the quote form on the home page
- **Contractor Registrations** — When someone registers on the contractor page

Each submission also sends an **email notification** to `emergesites@gmail.com`.

### Columns in Quote Requests
Submitted At | Name | Phone | Email | Service | Location | Preferred Date | Details | Photo Link

### Columns in Contractor Registrations
Submitted At | Name | Phone | Email | Area | Service | Experience | Notes

---

## Google Apps Script — Important Settings

Your Apps Script deployment must always have these settings:

| Setting | Required Value |
|---------|---------------|
| Execute as | **Me** (emergesites@gmail.com) |
| Who has access | **Anyone** |
| Version | **New version** (select this every time you update the code) |

**If forms stop working**, check these settings first:
1. Go to your Google Sheet → **Extensions** → **Apps Script**
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil/edit icon**
4. Make sure the settings match the table above
5. Select **New version** under Version
6. Click **Deploy**

---

## Changing the Notification Email

To change where form submissions are emailed:

1. Open your Google Sheet → **Extensions** → **Apps Script**
2. Find this line at the top of the code:
   ```
   const NOTIFICATION_EMAIL = 'emergesites@gmail.com';
   ```
3. Replace the email address with the new one
4. Click **Save**
5. **Redeploy** as a new version (Deploy → Manage deployments → Edit → New version → Deploy)

---

## WhatsApp Contact

The website links to WhatsApp at `+27 63 451 6432`. To change this number:

1. Open `index.html` and `contractor.html`
2. Search for `https://wa.me/27634516432`
3. Replace with your new number in format `https://wa.me/27XXXXXXXXX` (no spaces, no +)

---

## Updating Gallery Photos

To add new project photos to the gallery:

1. Save the image as `.jpeg` in the `img/` folder (use a subfolder like `BeforeAfterGrass/`)
2. Ask your developer to add the image to the `galleryImages` list in `app.js`
3. Each image needs: a file path, title, short description, and service category

Service categories available: Landscaping, Plumbing, Electrical, Renovations, Construction.

---

## Updating Slideshow Photos

The full-screen hero slideshow uses images from `img/SlideShow/`. To change slides:

1. Add or replace `.jpeg` files in the `img/SlideShow/` folder
2. Ask your developer to update the `heroSlides` list in `app.js`

---

## Hosting

This is a static website (no server required). It can be hosted on:

- **GitHub Pages** (free) — Enable in repo Settings → Pages
- **Netlify** (free tier) — Drag and drop the project folder
- **Vercel** (free tier) — Import the GitHub repo
- **Any web host** — Upload all files via FTP

No build step is needed. Just upload the files as they are.

---

## Need Help?

- **WhatsApp**: [+27 63 451 6432](https://wa.me/27634516432)
- **Email**: emergesites@gmail.com
