# Portfolio — Next.js 16 + Tailwind CSS 4

A world-class, ultra-modern portfolio website for IT professionals and entrepreneurs.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React + custom SVG social icons
- **Analytics**: Vercel Analytics + Speed Insights
- **Notifications**: Sonner

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customizing Your Portfolio

All personal data is in **one file**: `src/lib/data.ts`

| Export | What it controls |
|---|---|
| `personalInfo` | Name, bio, location, email, social links, stats |
| `techStack` | Skills organized by category with proficiency levels |
| `projects` | Project cards with tech, links, metrics |
| `services` | Service offerings with descriptions and pricing |
| `testimonials` | Client quotes and ratings |
| `experiences` | Work history and education timeline |
| `certifications` | Professional certifications |

### Adding a Real Avatar

Replace the emoji placeholder in `src/components/sections/Hero.tsx` with:

```tsx
import Image from "next/image";
// inside the avatar container:
<Image src="/avatar.jpg" alt="Your Name" fill className="object-cover" />
```

Place `avatar.jpg` in the `public/` folder.

## Sections

1. **Hero** — Animated canvas particles, typing effect, floating stats
2. **About** — Bio, experience timeline, certifications
3. **Tech Stack** — Category tabs with skill progress bars
4. **Projects** — Filterable grid with search, detail modals
5. **Services** — Service cards with features and pricing
6. **Testimonials** — Auto-rotating carousel
7. **Contact** — Form, WhatsApp, Calendly integration

## Features

- Animated loading screen
- Command palette (`Ctrl+K` / `⌘K`)
- Scroll-aware sticky navbar
- SEO: Open Graph, Twitter Cards, sitemap, robots.txt
- Vercel Analytics & Speed Insights

## Deployment

### Vercel (one command)

```bash
npx vercel
```

### Manual

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    layout.tsx        Root layout, fonts, metadata
    page.tsx          Main page (all sections)
    globals.css       Global styles & CSS variables
  components/
    layout/           Navbar, Footer
    sections/         Hero, About, TechStack, Projects, Services, Testimonials, Contact
    ui/               Button, SectionHeader, SocialIcons
    LoadingScreen.tsx
    CommandPalette.tsx
  lib/
    data.ts           ALL portfolio content — edit this file
    utils.ts          Helpers
```
