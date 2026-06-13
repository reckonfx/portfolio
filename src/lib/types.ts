export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

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
  title: string;
  taglines: string[];
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  resume: string;
  availability: string;
  avatar: string;
  social: SocialLinks;
  stats: Stat[];
  // CV-specific personal details (used by Pak/India, Saudi, Gulf, Lebenslauf formats)
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  religion?: string;
  maritalStatus?: string;
  cnic?: string;
  // Language skills (used by Europass)
  motherTongue?: string;
  languages?: { language: string; level: string }[];
  drivingLicence?: string;
}

export interface TechItem {
  name: string;
  level: number;
  icon: string;
}

export interface TechCategory {
  category: string;
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
  featured: boolean;
  status: "Live" | "In Development" | "Private";
  category: string;
  tags: string[];
  date: string;
  client: string;
  stars: number;
  metrics: Record<string, string>;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  price: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  project: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
  type: "work" | "entrepreneurship" | "education";
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  badge: string;
}

export interface SiteTheme {
  colorScheme: string;
  mode: "dark" | "light";
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  techStack: TechCategory[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  experiences: Experience[];
  certifications: Certification[];
  theme?: SiteTheme;
}
