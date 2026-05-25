# CV Starter Kit

Extracted from the portfolio project. Contains everything needed to build a
multi-format CV generator website — no rebuilding from scratch.

---

## What's included

| File | What it does |
|------|-------------|
| `lib/types.ts` | All data interfaces (`CVData`, `PersonalInfo`, `Experience`, etc.) |
| `lib/cv-generators.ts` | Server-side PDF generators using PDFKit — 6 formats |
| `components/CVPreview.tsx` | Client-side HTML preview + PDF download + WhatsApp/Email share |
| `api/resume-route.ts` | API route that generates and returns a PDF file |
| `api/share-cv-route.ts` | API route that emails the PDF as an attachment (nodemailer + Gmail) |

---

## CV Formats already built (Phase 1)

1. **Gulf CV** — navy header, photo top-right, ATS-friendly
2. **Saudi CV** — green header, personal details grid, religion/nationality fields
3. **Emirati CV** — dark sidebar, gold accents, UAE flag strip
4. **Europass** — EU standard, blue header, date | content two-column layout
5. **USA Resume** — centered name, no photo, bullet points, clean
6. **Canadian CV** — red accent, 3-column core competencies grid

---

## Next Milestone — Phase 2 Formats

5 high-demand formats not yet built. Add these after launch.

| # | Format | Key audience | Unique feature |
|---|--------|-------------|----------------|
| 7 | **Pakistan / India CV** | South Asian diaspora (Gulf, UK, Canada) | CNIC field, father's name, religion |
| 8 | **UK CV** | UK job market | No photo, 2 pages max, personal statement |
| 9 | **Australia / NZ CV** | ANZ job market + South Asian immigrants | References line, relaxed 2-3 pages |
| 10 | **Germany — Lebenslauf** | Germany job market + expats | Photo required, DOB, German section headers, signature |
| 11 | **Academic / Research CV** | Universities worldwide | Publications, conferences, grants — no page limit |

### German Translation Option
The Lebenslauf format will support a **DE / EN language toggle** so section
headers render in German ("Berufserfahrung", "Ausbildung", etc.) for authentic
German job applications. Other formats stay in English.
Full label mapping and implementation guide is in `PROMPT.md`.

---

## How the new website works (your idea)

```
User fills multi-step form
    → selects CV format
        → CVPreview renders instantly (HTML)
            → user clicks Download → PDF generated client-side (jsPDF)
            → user clicks Share → email or WhatsApp
```

---

## Adaptations needed for the new project

### 1. `lib/cv-generators.ts`
- Remove the first line: `import "server-only";`
- Change: `import type { PortfolioData } from "./types";`
  to:    `import type { CVData } from "./types";`
- Replace every `PortfolioData` with `CVData` in function signatures
- The `avatarPath()` function reads from local filesystem — on Vercel,
  replace with the user-uploaded image URL directly

### 2. `components/CVPreview.tsx`
- Change: `import type { PortfolioData, ... } from "@/lib/types";`
  to:    `import type { CVData, ... } from "@/lib/types";`
- Replace every `PortfolioData` with `CVData`
- The `data` prop comes from your form state, not a server call

### 3. `api/resume-route.ts`
- Already adapted in this file — accepts user data as POST body
- In the original it read from `readData()` (portfolio.json), now it
  reads the user's form data from the request body

### 4. `api/share-cv-route.ts`
- No changes needed — it already accepts arbitrary data via POST
- Set environment variables: `GMAIL_USER` and `GMAIL_APP_PASSWORD`

### 5. Build the multi-step form
This is the main new work. Collect:
- Personal info: name, title, email, phone, location, website, photo
- Work experience: (multiple) title, company, period, description, tech stack
- Education: (multiple) degree, school, period, description
- Skills: categories with items (or just a flat list)
- Projects: (optional) title, description, tech, url
- Certifications: (optional) name, issuer, year

---

## npm packages needed

```bash
npm install pdfkit           # server-side PDF (cv-generators.ts)
npm install jspdf            # client-side PDF (CVPreview.tsx)
npm install html-to-image    # screenshot HTML to image (CVPreview.tsx)
npm install nodemailer       # email sharing (share-cv-route.ts)
```

Types:
```bash
npm install -D @types/pdfkit @types/nodemailer
```

---

## Data structure example (what your form collects)

```typescript
const cvData: CVData = {
  personalInfo: {
    name: "John Smith",
    title: "Senior Software Engineer",
    bio: "10 years building scalable web applications...",
    location: "Dubai, UAE",
    email: "john@example.com",
    phone: "+971 50 123 4567",
    website: "https://johnsmith.dev",
    avatar: "https://...",          // uploaded photo URL
    social: { linkedin: "...", github: "...", /* rest empty */ },
    // leave these empty for the CV builder:
    taglines: [], resume: "", availability: "", stats: [],
  },
  techStack: [
    {
      category: "Frontend",
      icon: "💻", color: "#3b82f6",
      items: [
        { name: "React", level: 90, icon: "" },
        { name: "TypeScript", level: 85, icon: "" },
      ]
    }
  ],
  experiences: [
    {
      title: "Senior Engineer",
      company: "Acme Corp",
      period: "Jan 2021 – Present",
      description: "Led a team of 5 engineers...",
      tech: ["React", "Node.js", "PostgreSQL"],
      type: "work",
    },
    {
      title: "BSc Computer Science",
      company: "MIT",
      period: "2010 – 2014",
      description: "Graduated with honors.",
      tech: [],
      type: "education",
    }
  ],
  projects: [
    {
      id: 1, title: "My SaaS App", description: "...",
      featured: true,              // only featured: true shows in CV
      tech: ["Next.js", "Stripe"],
      github: "", demo: "", vercel: "", image: "", video: "",
      status: "Live", category: "SaaS", tags: [],
      date: "2023-06", client: "", stars: 0, metrics: {},
    }
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon", year: 2023, badge: "" }
  ],
  services: [], testimonials: [],
};
```

---

## Photo handling — NO storage needed

The photo is temporary and only needed for PDF generation.
Use a browser blob URL — it never leaves the user's device:

```javascript
// In the form (React):
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  const blobUrl = URL.createObjectURL(file);
  setCvData(prev => ({
    ...prev,
    personalInfo: { ...prev.personalInfo, avatar: blobUrl }
  }));
}
// Pass cvData.personalInfo.avatar = blobUrl to CVPreview
// CVPreview renders <img src={blobUrl}> — works fine in browser
// html-to-image captures it — works fine
// PDF is generated — photo is embedded in the PDF
// When user closes the tab — blob is automatically released
// Nothing saved to server, database, or storage
```

The PDFKit server-side generators (cv-generators.ts) have an `avatarPath()`
function that reads from local filesystem — this is NOT used for downloads.
Downloads use the client-side html-to-image + jsPDF path in CVPreview.tsx,
which reads the blob URL directly from the rendered HTML. No server call needed.

---

## Quick start for the new project

```bash
npx create-next-app@latest cv-builder --typescript --tailwind --app
cd cv-builder
npm install pdfkit jspdf html-to-image nodemailer
npm install -D @types/pdfkit @types/nodemailer
```

Then copy these files into the new project:
- `lib/types.ts` → `src/lib/types.ts`
- `lib/cv-generators.ts` → `src/lib/cv-generators.ts`  (apply adaptations above)
- `components/CVPreview.tsx` → `src/components/CVPreview.tsx`  (apply adaptations)
- `api/resume-route.ts` → `src/app/api/resume/route.ts`
- `api/share-cv-route.ts` → `src/app/api/share-cv/route.ts`

Build the multi-step form page at `src/app/page.tsx` or `src/app/builder/page.tsx`.
