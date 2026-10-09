# LDF Website Kit

A responsive, multi-page static website starter for Life Development Foundation, designed for GitHub Pages. It uses HTML, CSS and vanilla JavaScript—no build step or paid dependency is required.

## Files included

- `index.html` — Home
- `about.html` — About LDF
- `our-work.html` — Focus areas and programmes
- `hope.html` — HOPE project overview
- `learning.html` — Learning Hub overview
- `impact.html` — Impact and reporting
- `gallery.html` — Gallery starter
- `get-involved.html` — Volunteers, careers and partners
- `contact.html` — Email-draft contact form
- `privacy.html`, `terms.html`, `accessibility.html` — policy frameworks that require review
- `404.html` — custom not-found page
- `css/style.css` — responsive blue-and-white theme
- `js/main.js` — shared navigation, footer, app links and contact form behaviour
- `js/config.js` — central settings and app destinations
- `assets/images/` — editable SVG illustrations and LDF mark

## Before publishing

1. Open `js/config.js`.
2. Verify the HOPE App URL is still correct.
3. Add the actual Learning Hub URL when confirmed.
4. Confirm the AI assistant URL is still correct.
5. Add the Admin Central URL only when the deployment is correct and access is enforced by its backend. Hiding a link is not security.
6. Replace illustrative gallery SVGs with authentic, approved photos; use appropriate consent and protect beneficiary identities.
7. Review all organisational facts, programme statuses, policies and claims. Do not publish unverified registration details, statistics or testimonials.
8. Test the contact form. It opens the visitor's email application and does not save submissions. For a database-backed form, connect a secure form service or backend.

## Deploy to GitHub Pages

1. Download and unzip this kit.
2. Back up your current repository before replacing files.
3. Upload the contents of this folder into the repository root (the folder should contain `index.html`, not another nested copy of the kit folder).
4. Preserve any existing integrations you still need. Compare old files before replacing them.
5. In GitHub, open **Settings → Pages** and confirm the publishing branch and folder (commonly `main` and `/ (root)`).
6. Wait for the deployment to finish, then open the live site on desktop and phone.
7. Test every navigation link, contact email draft, app link, image and the 404 page.

## Notes

- This is a public website kit, not the HOPE or Learning Hub backend.
- The contact form uses `mailto:` and requires the visitor to press Send in their email app.
- `privacy.html` and `terms.html` are frameworks, not finished legal advice.
- Admin Central must have its own authentication, authorisation and backend security. A public GitHub Pages page cannot safely keep secrets.
- Proposed future links should be activated only after their destination pages or services exist.
