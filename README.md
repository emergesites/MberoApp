# SMP Landscaping & Construction Services — Developer Guide

Static landing page for SMP Landscaping & Construction Services. No build step, no framework — HTML + Tailwind CDN + vanilla JS.

## Project Structure

```
index.html            Main site (hero, about, gallery, quote form, contact)
contractor.html       Contractor registration page
app.js                All client-side logic (slideshow, gallery, forms)
google-apps-script.gs Apps Script code (paste into Google Sheets project)
img/
  Logo.jpeg           Favicon + header logo
  SlideShow/          Hero slideshow images (auto-discovered by app.js)
  BeforeAfterGrass/   Landscaping before/after photos
  BeforeAfterPipe/    Plumbing before/after photos
```

## Running Locally

```bash
# Any static server works
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

## How It Works

### Hero Slideshow
`app.js` defines a `heroSlides` array with images from `img/SlideShow/`. Slides auto-advance every 4.5s using opacity transitions. Nav dots at the bottom allow manual navigation.

### Gallery
Images are defined in `galleryImages` array in `app.js`, each tagged with a `service` string (`Landscaping`, `Plumbing`, `Electrical`, `Renovations`, `Construction`). Filter tabs render dynamically. Pagination shows 6 images initially; a "Show more" button reveals the rest. Clicking an image opens a lightbox modal.

### Form Submissions
Both forms POST JSON to a Google Apps Script web app endpoint (`GOOGLE_APPS_SCRIPT_URL` in `app.js`). The fetch uses `mode: "no-cors"` to avoid CORS preflight issues with Apps Script's redirect chain. The JSON body is sent as `text/plain` (browser default for string body) and parsed server-side via `e.postData.contents`.

### Apps Script (`google-apps-script.gs`)
- `doPost(e)` routes by `formType`: `"quote"` → `Quote Requests` sheet tab, `"contractor"` → `Contractor Registrations` tab.
- Both form types send email notifications to `NOTIFICATION_EMAIL`.
- Deployment must be: **Execute as: Me**, **Who has access: Anyone**, and a **new version** must be selected each time the code changes.

## Adding Gallery Images

1. Add the image file to the appropriate `img/` subfolder.
2. Add an entry to the `galleryImages` array in `app.js`:
   ```js
   { image: "SubFolder/filename.jpeg", title: "Title", description: "Description", service: "Landscaping" }
   ```
3. Valid `service` values: `Landscaping`, `Plumbing`, `Electrical`, `Renovations`, `Construction`.

## Adding Slideshow Slides

Add an entry to the `heroSlides` array in `app.js`:
```js
{ image: "SlideShow/filename.jpeg", label: "Service Name", heading: "Heading text", sub: "Subheading text" }
```

## Changing the Apps Script URL

Update the `GOOGLE_APPS_SCRIPT_URL` constant at the top of `app.js`.

## Tech Stack

- **HTML/CSS**: Tailwind CSS via CDN (`v3.4.17`)
- **JS**: Vanilla ES2020+, no dependencies
- **Backend**: Google Apps Script (serverless), Google Sheets as database
- **Email**: `MailApp.sendEmail()` via Apps Script
