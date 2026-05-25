# Portfolio Website — Roadmap

---

## Done

- Portfolio site live on Vercel at aamirshamsi.dev
- Admin CMS at /admin — full content management (projects, experience, skills, etc.)
- 6 CV formats with live preview, PDF download, WhatsApp + email share
- Color theme picker in admin (6 themes, dark/light mode)
- Auto GitHub → Vercel deploy on every admin save
- Project media: screenshot capture + file upload → saved to GitHub

---

## Next Milestone — CV Builder (Phase 2)

Launch a public CV builder at `aamirshamsi.dev/cv` (or separate domain later).

Users fill a multi-step form → select a format → CV generated instantly.
No login. No storage. Photo is a temporary blob URL, never saved.

### Phase 2A — Launch with 6 formats (reuse from portfolio)

Copy the existing CV engine into the new project:
- `_cv-starter/` folder has everything ready — read `PROMPT.md` first
- Gulf, Saudi, Emirati, Europass, USA, Canada — all built and tested
- CVPreview component handles download, WhatsApp share, email share

New work needed: multi-step form to collect user data (personal info, experience,
education, skills, projects, certifications) and format selection screen.

### Phase 2B — Add 5 missing high-demand formats

| # | Format | Key market |
|---|--------|-----------|
| 7 | Pakistan / India CV | South Asian diaspora applying to Gulf, UK, Canada |
| 8 | UK CV | UK job market — no photo, 2 pages, personal statement |
| 9 | Australia / New Zealand CV | ANZ market + South Asian immigrants |
| 10 | Germany — Lebenslauf | German job market — photo, DOB, signature required |
| 11 | Academic / Research CV | Universities worldwide — publications, grants, conferences |

### Phase 2C — German Translation

Lebenslauf format gets a DE / EN language toggle.
Section headers render in German: "Berufserfahrung", "Ausbildung", etc.
Details in `_cv-starter/PROMPT.md` under "German Translation Option".

---

## Future Ideas

- Paid premium formats or templates
- CV improvement suggestions (AI-powered)
- LinkedIn import to auto-fill the form
- Multiple language support beyond German
