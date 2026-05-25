// ─────────────────────────────────────────────────────────────────────────────
// CV DATA TYPES
// These are the interfaces that cv-generators.ts and CVPreview.tsx expect.
// In your new project, collect these from a multi-step form and pass them in.
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  discord: string;
  whatsapp: string;
  calendly: string;
}

export interface PersonalInfo {
  name: string;
  title: string;           // e.g. "Software Engineer"
  bio: string;             // Professional summary / about paragraph
  location: string;
  email: string;
  phone: string;
  website: string;
  avatar: string;          // URL or path to profile photo
  social: SocialLinks;
  // Not needed by CV generators (portfolio-specific fields) — can leave empty:
  taglines: string[];
  resume: string;
  availability: string;
  stats: { label: string; value: number; suffix: string }[];
}

export interface TechItem {
  name: string;
  level: number;           // 0-100 proficiency
  icon: string;
}

export interface TechCategory {
  category: string;        // e.g. "Frontend", "Backend", "DevOps"
  icon: string;
  color: string;
  items: TechItem[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github: string;
  demo: string;
  vercel: string;
  image: string;
  video?: string;
  featured: boolean;       // Only featured: true projects appear in CV
  status: "Live" | "In Development" | "Private";
  category: string;
  tags: string[];
  date: string;            // e.g. "2024-01"
  client: string;
  stars: number;
  metrics: Record<string, string>;
}

export interface Experience {
  title: string;           // Job title / degree name
  company: string;         // Company / university name
  period: string;          // e.g. "Jan 2020 – Present"
  description: string;     // Responsibilities / achievements paragraph
  tech: string[];          // Technologies used (shown as tags)
  type: "work" | "entrepreneurship" | "education";
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  badge: string;
}

// Root object passed to all generators and CVPreview
export interface CVData {
  personalInfo: PersonalInfo;
  techStack: TechCategory[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  // Not needed for CV generation — can omit or leave empty arrays:
  services: unknown[];
  testimonials: unknown[];
}
