# CV Builder — Project Briefing for Claude

## What this project is

A web app where users fill a multi-step form with their CV information, select a
format (Gulf, Saudi, Emirati, Europass, USA, Canada), and their CV is generated
instantly as a downloadable PDF. No login, no account, no storage — one session,
one CV, done.

---

## What is already built (files in this folder)

Read ALL of these files carefully before writing any code.

### `lib/types.ts`
Defines the full data structure (`CVData`) that flows through the entire app.
Every form field maps to a field in this type. The CV generators and preview
component both expect exactly this shape.

### `lib/cv-generators.ts`
Server-side PDF generators using PDFKit. 6 formats already fully implemented:
- `generateGulfCV(data)` — navy header, photo, Gulf region style
- `generateSaudiCV(data)` — green header, personal details grid, Saudi style
- `generateEmiratiCV(data)` — dark sidebar, gold accents, UAE flag
- `generateEuropassCV(data)` — EU standard, blue header, date | content layout
- `generateUSACV(data)` — centered name, no photo, bullet points, clean
- `generateCanadaCV(data)` — red accent, 3-column competencies grid

**Adapt before using:**
- Remove first line: `import "server-only";`
- Change `PortfolioData` → `CVData` everywhere in this file

### `components/CVPreview.tsx`
Client-side React component. Does everything:
- Renders live HTML preview of the selected CV format
- Download PDF button — uses html-to-image + jsPDF (client-side, no server call)
- WhatsApp share button
- Email share button (sends PDF as attachment via `/api/share-cv`)
- Auto-downloads on page load

**Adapt before using:**
- Change `PortfolioData` → `CVData` everywhere in this file

### `api/resume-route.ts`
Next.js API route for server-side PDF download (backup method).
Already adapted to accept POST body with user CVData.
Place at: `src/app/api/resume/route.ts`

### `api/share-cv-route.ts`
Next.js API route that emails the PDF as an attachment using nodemailer + Gmail.
No changes needed. Requires env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
Place at: `src/app/api/share-cv/route.ts`

---

## How PDF generation works (important)

There are TWO methods. The Download button uses METHOD 2.

**Method 1 — Server-side (cv-generators.ts + PDFKit):**
User data → POST /api/resume → PDFKit draws PDF → returns PDF file
Used as backup. Limitation: no emoji, limited fonts.

**Method 2 — Client-side (CVPreview.tsx + html-to-image + jsPDF):**
User data → CVPreview renders HTML → html-to-image screenshots it → jsPDF
packages the screenshot into a PDF → user downloads.
This is the PRIMARY method. Preserves exact colors, fonts, layout.

---

## Photo handling — NO backend storage

Photo is temporary, only needed for PDF generation. Never saved anywhere.

```javascript
const blobUrl = URL.createObjectURL(file);
// Set cvData.personalInfo.avatar = blobUrl
// CVPreview renders <img src={blobUrl}> — works
// html-to-image captures it — works
// Photo is embedded in the downloaded PDF
// Blob is released when user closes the tab
```

No upload API. No Cloudinary. No S3. Nothing.

---

## What needs to be built (your job in the new project)

Everything below is NEW — nothing exists yet for the new project.

### 1. Multi-step form (main page)
Collect all fields from `CVData` in `lib/types.ts`. Suggested steps:

**Step 1 — Personal Info**
- Full name, job title, email, phone, location, website
- Professional summary / bio (textarea)
- Profile photo upload → blob URL (no upload, just URL.createObjectURL)
- Social links: LinkedIn, GitHub (optional)

**Step 2 — Work Experience**
- Add multiple entries: job title, company, period, description, tech stack used
- type = "work" or "entrepreneurship"

**Step 3 — Education**
- Add multiple entries: degree/qualification, institution, period, description
- type = "education"

**Step 4 — Skills**
- Categories (Frontend, Backend, DevOps, etc.) each with items
- Or simplified: just a flat list of skill names grouped under one category

**Step 5 — Projects** (optional)
- Add multiple: title, description, tech stack
- Mark featured = true to include in CV (only featured ones appear)

**Step 6 — Certifications** (optional)
- Name, issuer, year

**Step 7 — Choose Format + Generate**
- Show 6 format cards with a preview/description of each
- User clicks one → navigate to preview page with their data + selected format

### 2. CV Preview page
- Receives CVData + format via URL params or state
- Renders `<CVPreview data={cvData} format={format} />`
- That's it — CVPreview handles everything else (download, share, etc.)

### 3. API routes
- Copy `api/resume-route.ts` → `src/app/api/resume/route.ts`
- Copy `api/share-cv-route.ts` → `src/app/api/share-cv/route.ts`

---

## Tech stack for the new project

```bash
npx create-next-app@latest cv-builder --typescript --tailwind --app
npm install pdfkit jspdf html-to-image nodemailer
npm install -D @types/pdfkit @types/nodemailer
```

---

## Key things to remember

- `CVData.experiences` holds BOTH work and education — separated by `type` field
- Only projects with `featured: true` appear in the CV
- `CVData.services` and `CVData.testimonials` are unused by CV generators — pass empty arrays
- All 6 CVPreview format components use inline styles (not Tailwind) so they print correctly
- The `data-cv-section="true"` attribute on section divs is required — used by the
  PDF pagination logic in CVPreview to prevent section breaks mid-content
- `GMAIL_APP_PASSWORD` must be a Gmail App Password (not your regular password)
  — generate at myaccount.google.com/apppasswords

---

## What NOT to build

- No login / auth
- No database
- No saving CVs server-side
- No photo storage (blob URL only)
- No payment (for now)

---

## Next Milestone — Additional CV Formats (Phase 2)

These formats are NOT yet built. Add them in Phase 2 after launch.

### Missing formats (priority order):

**1. Pakistan / India CV**
- Most relevant audience (South Asian diaspora applying to Gulf + UK + Canada)
- Fields: CNIC / Aadhaar number (optional), father's name, religion, nationality
- Photo top-right, conservative layout, detailed personal info section
- Accent color: deep green (#006400) or navy

**2. UK CV**
- No photo, no age, no marital status (illegal to ask in UK)
- 2 pages max — strict
- Personal statement at top (3-4 lines)
- Clean, minimal, Times New Roman or Arial
- Very different from USA despite same language

**3. Australia / New Zealand CV**
- Similar to UK but slightly more relaxed
- Include "References available upon request" at bottom
- No photo, but residency/visa status sometimes mentioned
- Clean layout, 2-3 pages acceptable

**4. Germany — Lebenslauf**
- Photo mandatory (top-right, professional)
- Date of birth, place of birth, nationality, marital status — all required
- Signature at bottom (user types name or uploads signature image)
- Section headers IN GERMAN (see translation note below)
- Reverse chronological, very formal
- Accent: black / dark gray — minimal color

**5. Academic / Research CV**
- Completely different structure from job CVs
- Sections: Publications, Conference Papers, Research Projects, Teaching Experience,
  Grants & Funding, Academic Awards, Professional Memberships
- No page limit (academics can have 10+ page CVs)
- Clean, no color, university-style formatting

---

## German Translation Option (for Lebenslauf format)

The Lebenslauf CV should render section headers in German.
Add a language toggle (DE / EN) on the format selection step.

German section labels:
- "Personal Statement" → "Persönliches Profil"
- "Work Experience" → "Berufserfahrung"
- "Education" → "Ausbildung"
- "Technical Skills" → "Technische Kenntnisse"
- "Key Projects" → "Schlüsselprojekte"
- "Certifications" → "Zertifizierungen"
- "Languages" → "Sprachkenntnisse"
- "References" → "Referenzen"

Implementation: add a `language: "en" | "de"` field to CVData.
In the Lebenslauf generator and preview component, use a labels object:
```typescript
const LABELS = {
  en: { experience: "Work Experience", education: "Education", ... },
  de: { experience: "Berufserfahrung", education: "Ausbildung", ... },
};
```
Pass `language` through and use `LABELS[language].experience` etc.
