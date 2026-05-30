"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, User, Upload, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import type { PortfolioData, Experience, Project, Certification, TechCategory } from "@/lib/types";

// ─── Internal form types ───────────────────────────────────────────────────────

interface PersonalForm {
  name: string; title: string; bio: string;
  email: string; phone: string; location: string; website: string;
  linkedin: string; github: string;
  nationality: string; dateOfBirth: string; placeOfBirth: string;
  religion: string; maritalStatus: string; cnic: string;
}
interface WorkEntry { title: string; company: string; period: string; description: string; tech: string; type: "work" | "entrepreneurship"; }
interface EduEntry { degree: string; institution: string; period: string; description: string; }
interface SkillCat { category: string; items: string; }
interface ProjectEntry { title: string; description: string; tech: string; url: string; }
interface CertEntry { name: string; issuer: string; year: string; }

// ─── Constants ─────────────────────────────────────────────────────────────────

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Projects", "Certifications", "Generate CV"];

const CV_FORMATS = [
  { id: "gulf",         name: "Gulf CV",          flag: "🇦🇪", region: "GCC / Gulf",          photo: true,  desc: "Navy header, photo, ATS-friendly" },
  { id: "saudi",        name: "Saudi CV",          flag: "🇸🇦", region: "Saudi Arabia",         photo: true,  desc: "Green header, religion & nationality" },
  { id: "emirati",      name: "Emirati CV",        flag: "🇦🇪", region: "UAE",                  photo: true,  desc: "Dark sidebar, gold accents" },
  { id: "europass",     name: "Europass CV",       flag: "🇪🇺", region: "Europe",               photo: true,  desc: "EU standard, blue header" },
  { id: "usa",          name: "USA Resume",        flag: "🇺🇸", region: "United States",        photo: false, desc: "No photo, clean bullets" },
  { id: "canada",       name: "Canadian CV",       flag: "🇨🇦", region: "Canada",               photo: false, desc: "Red accent, competencies grid" },
  { id: "pakIndia",     name: "Pakistan / India",  flag: "🇵🇰", region: "Pakistan · India",     photo: true,  desc: "Personal details grid, declaration" },
  { id: "uk",           name: "UK CV",             flag: "🇬🇧", region: "United Kingdom",       photo: false, desc: "Personal statement, 2-page max" },
  { id: "anz",          name: "Australia / NZ",    flag: "🇦🇺", region: "Australia · NZ",       photo: false, desc: "Professional profile, references" },
  { id: "lebenslauf",   name: "Lebenslauf (EN)",   flag: "🇩🇪", region: "Germany — English",    photo: true,  desc: "Tabular layout, signature" },
  { id: "lebenslauf-de",name: "Lebenslauf (DE)",   flag: "🇩🇪", region: "Germany — Deutsch",    photo: true,  desc: "Berufserfahrung · Ausbildung" },
  { id: "academic",     name: "Academic CV",       flag: "🎓", region: "Universities",          photo: false, desc: "Research, publications, no page limit" },
];

// ─── Styling helpers ───────────────────────────────────────────────────────────

const inp = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-700/80 transition-colors cursor-text";
const lbl = "block text-slate-300 text-xs font-medium mb-1.5";
const ta  = inp + " resize-none";
const card = "bg-slate-900 border border-slate-800 rounded-xl p-5";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><label className={lbl}>{label}</label>{children}</div>;
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 text-indigo-400 text-sm hover:text-indigo-300 transition-colors mt-3">
      <Plus className="w-4 h-4" />{label}
    </button>
  );
}

function DelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// ─── Build PortfolioData from form state ───────────────────────────────────────

function buildData(
  personal: PersonalForm, avatar: string,
  work: WorkEntry[], edu: EduEntry[],
  skills: SkillCat[], projects: ProjectEntry[], certs: CertEntry[],
): PortfolioData {
  const experiences: Experience[] = [
    ...work.filter(e => e.title.trim()).map(e => ({
      title: e.title, company: e.company, period: e.period,
      description: e.description,
      tech: e.tech.split(",").map(t => t.trim()).filter(Boolean),
      type: e.type,
    })),
    ...edu.filter(e => e.degree.trim()).map(e => ({
      title: e.degree, company: e.institution, period: e.period,
      description: e.description, tech: [],
      type: "education" as const,
    })),
  ];

  const techStack: TechCategory[] = skills.filter(s => s.category.trim()).map(s => ({
    category: s.category, icon: "💻", color: "#6366f1",
    items: s.items.split(",").map(i => i.trim()).filter(Boolean).map(name => ({ name, level: 80, icon: "" })),
  }));

  const projectList: Project[] = projects.filter(p => p.title.trim()).map((p, i) => ({
    id: i + 1, title: p.title, description: p.description,
    tech: p.tech.split(",").map(t => t.trim()).filter(Boolean),
    github: p.url || "", demo: "", vercel: "", image: "", video: "",
    featured: true, status: "Live" as const, category: "Project",
    tags: [], date: "", client: "", stars: 0, metrics: {},
  }));

  const certList: Certification[] = certs.filter(c => c.name.trim()).map(c => ({
    name: c.name, issuer: c.issuer,
    year: parseInt(c.year) || new Date().getFullYear(), badge: "",
  }));

  return {
    personalInfo: {
      name: personal.name, title: personal.title, bio: personal.bio,
      location: personal.location, email: personal.email, phone: personal.phone,
      website: personal.website, avatar,
      resume: "", availability: "", taglines: [], stats: [],
      social: { github: personal.github, linkedin: personal.linkedin, twitter: "", instagram: "", youtube: "", discord: "", whatsapp: "", calendly: "" },
      nationality: personal.nationality, dateOfBirth: personal.dateOfBirth,
      placeOfBirth: personal.placeOfBirth, religion: personal.religion,
      maritalStatus: personal.maritalStatus, cnic: personal.cnic,
    },
    techStack, experiences, projects: projectList, certifications: certList,
    services: [], testimonials: [],
  };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CVBuilderPage() {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<PersonalForm>({
    name: "", title: "", bio: "", email: "", phone: "", location: "",
    website: "", linkedin: "", github: "",
    nationality: "", dateOfBirth: "", placeOfBirth: "",
    religion: "", maritalStatus: "", cnic: "",
  });
  const [avatar, setAvatar] = useState(""); // base64 data URL
  const [work, setWork] = useState<WorkEntry[]>([{ title: "", company: "", period: "", description: "", tech: "", type: "work" }]);
  const [edu, setEdu] = useState<EduEntry[]>([{ degree: "", institution: "", period: "", description: "" }]);
  const [skills, setSkills] = useState<SkillCat[]>([{ category: "", items: "" }]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [certs, setCerts] = useState<CertEntry[]>([]);
  const [showRegional, setShowRegional] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sp = (k: keyof PersonalForm) => (v: string) => setPersonal(p => ({ ...p, [k]: v }));

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function generate(formatId: string) {
    const data = buildData(personal, avatar, work, edu, skills, projects, certs);
    try { sessionStorage.setItem("cv-builder-data", JSON.stringify(data)); } catch {}
    window.open(`/cv/preview?format=${formatId}`, "_blank");
  }

  // ── Steps ───────────────────────────────────────────────────────────────────

  const stepContent = [

    // ── Step 0: Personal Info ────────────────────────────────────────────────
    <div key="personal" className="space-y-6">
      <div className={card}>
        <h3 className="text-white font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/[0.04] border border-white/10 flex items-center justify-center">
              {avatar
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover object-top" />
                : <User className="w-8 h-8 text-slate-600" />}
            </div>
            {avatar && (
              <button onClick={() => setAvatar("")}
                className="absolute top-0 right-0 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
          <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-indigo-500/40 cursor-pointer transition-colors"
            onClick={() => fileRef.current?.click()}>
            <Upload className="w-5 h-5 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Click to upload photo</p>
            <p className="text-slate-600 text-xs mt-1">JPG, PNG, WebP</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-white font-semibold mb-4">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name *"><input className={inp} value={personal.name} onChange={e => sp("name")(e.target.value)} placeholder="John Smith" /></Field>
          <Field label="Job Title / Profession *"><input className={inp} value={personal.title} onChange={e => sp("title")(e.target.value)} placeholder="Software Engineer" /></Field>
          <Field label="Email *"><input className={inp} type="email" value={personal.email} onChange={e => sp("email")(e.target.value)} placeholder="john@example.com" /></Field>
          <Field label="Phone *"><input className={inp} value={personal.phone} onChange={e => sp("phone")(e.target.value)} placeholder="+971 50 123 4567" /></Field>
          <Field label="Location *"><input className={inp} value={personal.location} onChange={e => sp("location")(e.target.value)} placeholder="Dubai, UAE" /></Field>
          <Field label="Website"><input className={inp} value={personal.website} onChange={e => sp("website")(e.target.value)} placeholder="https://yoursite.com" /></Field>
          <Field label="LinkedIn"><input className={inp} value={personal.linkedin} onChange={e => sp("linkedin")(e.target.value)} placeholder="linkedin.com/in/yourname" /></Field>
          <Field label="GitHub"><input className={inp} value={personal.github} onChange={e => sp("github")(e.target.value)} placeholder="github.com/yourname" /></Field>
        </div>
        <Field label="Professional Summary *" className="mt-4">
          <textarea className={ta} rows={4} value={personal.bio} onChange={e => sp("bio")(e.target.value)}
            placeholder="Write a 2-4 sentence professional summary describing your background, key skills, and what you bring to the table..." />
        </Field>
      </div>

      <div className={card}>
        <button type="button" onClick={() => setShowRegional(v => !v)}
          className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors w-full text-left">
          <span className="text-indigo-400">+</span>
          <span>{showRegional ? "Hide" : "Show"} Regional CV Details</span>
          <span className="text-slate-600 text-xs ml-1">(Nationality, DOB, Religion — for Gulf, German, South Asian CVs)</span>
        </button>
        {showRegional && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Nationality"><input className={inp} value={personal.nationality} onChange={e => sp("nationality")(e.target.value)} placeholder="Pakistani" /></Field>
            <Field label="Date of Birth"><input className={inp} value={personal.dateOfBirth} onChange={e => sp("dateOfBirth")(e.target.value)} placeholder="15 March 1990" /></Field>
            <Field label="Place of Birth"><input className={inp} value={personal.placeOfBirth} onChange={e => sp("placeOfBirth")(e.target.value)} placeholder="Karachi, Pakistan" /></Field>
            <Field label="Religion"><input className={inp} value={personal.religion} onChange={e => sp("religion")(e.target.value)} placeholder="Islam" /></Field>
            <Field label="Marital Status"><input className={inp} value={personal.maritalStatus} onChange={e => sp("maritalStatus")(e.target.value)} placeholder="Married" /></Field>
            <Field label="CNIC / National ID"><input className={inp} value={personal.cnic} onChange={e => sp("cnic")(e.target.value)} placeholder="42101-1234567-8" /></Field>
          </div>
        )}
      </div>
    </div>,

    // ── Step 1: Work Experience ───────────────────────────────────────────────
    <div key="work" className="space-y-4">
      {work.map((e, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Experience {i + 1}</span>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {(["work", "entrepreneurship"] as const).map(t => (
                  <button key={t} type="button"
                    onClick={() => setWork(w => w.map((x, j) => j === i ? { ...x, type: t } : x))}
                    className={`px-3 py-1 text-xs transition-colors ${e.type === t ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                    {t === "work" ? "Employment" : "Self-Employed"}
                  </button>
                ))}
              </div>
              {work.length > 1 && <DelBtn onClick={() => setWork(w => w.filter((_, j) => j !== i))} />}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job Title *"><input className={inp} value={e.title} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, title: ev.target.value } : x))} placeholder="Senior Developer" /></Field>
            <Field label="Company / Organization"><input className={inp} value={e.company} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, company: ev.target.value } : x))} placeholder="Acme Corp" /></Field>
            <Field label="Period" className="sm:col-span-2"><input className={inp} value={e.period} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} placeholder="Jan 2021 – Present" /></Field>
          </div>
          <Field label="Description / Responsibilities" className="mt-4">
            <textarea className={ta} rows={3} value={e.description}
              onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Describe your key responsibilities and achievements. Include numbers where possible (e.g. Led team of 5, increased performance by 40%)." />
          </Field>
          <Field label="Technologies Used (comma-separated)" className="mt-4">
            <input className={inp} value={e.tech} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, tech: ev.target.value } : x))} placeholder="React, Node.js, PostgreSQL, Docker" />
          </Field>
        </div>
      ))}
      <AddBtn onClick={() => setWork(w => [...w, { title: "", company: "", period: "", description: "", tech: "", type: "work" }])} label="Add Another Experience" />
    </div>,

    // ── Step 2: Education ─────────────────────────────────────────────────────
    <div key="edu" className="space-y-4">
      {edu.map((e, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Education {i + 1}</span>
            {edu.length > 1 && <DelBtn onClick={() => setEdu(d => d.filter((_, j) => j !== i))} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Degree / Qualification *"><input className={inp} value={e.degree} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, degree: ev.target.value } : x))} placeholder="BSc Computer Science" /></Field>
            <Field label="Institution *"><input className={inp} value={e.institution} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, institution: ev.target.value } : x))} placeholder="University of London" /></Field>
            <Field label="Period" className="sm:col-span-2"><input className={inp} value={e.period} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} placeholder="2016 – 2020" /></Field>
          </div>
          <Field label="Description / Achievements" className="mt-4">
            <textarea className={ta} rows={2} value={e.description}
              onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Graduated with honours. Thesis on machine learning. CGPA: 3.8/4.0" />
          </Field>
        </div>
      ))}
      <AddBtn onClick={() => setEdu(d => [...d, { degree: "", institution: "", period: "", description: "" }])} label="Add Another Education" />
    </div>,

    // ── Step 3: Skills ────────────────────────────────────────────────────────
    <div key="skills" className="space-y-4">
      <p className="text-slate-500 text-sm">Group your skills into categories. Each category will appear as a tagged section in your CV.</p>
      {skills.map((s, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Skill Category {i + 1}</span>
            {skills.length > 1 && <DelBtn onClick={() => setSkills(sk => sk.filter((_, j) => j !== i))} />}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category Name *">
              <input className={inp} value={s.category} onChange={ev => setSkills(sk => sk.map((x, j) => j === i ? { ...x, category: ev.target.value } : x))} placeholder="Frontend" />
            </Field>
            <Field label="Skills (comma-separated) *" className="sm:col-span-2">
              <input className={inp} value={s.items} onChange={ev => setSkills(sk => sk.map((x, j) => j === i ? { ...x, items: ev.target.value } : x))} placeholder="React, TypeScript, Next.js, Tailwind CSS" />
            </Field>
          </div>
        </div>
      ))}
      <AddBtn onClick={() => setSkills(sk => [...sk, { category: "", items: "" }])} label="Add Another Category" />
    </div>,

    // ── Step 4: Projects (optional) ───────────────────────────────────────────
    <div key="projects" className="space-y-4">
      <p className="text-slate-500 text-sm">Optional — add notable projects. Only featured projects appear in your CV (all added here are featured).</p>
      {projects.length === 0 && (
        <div className={`${card} text-center py-8`}>
          <p className="text-slate-500 text-sm mb-3">No projects added yet</p>
          <AddBtn onClick={() => setProjects([{ title: "", description: "", tech: "", url: "" }])} label="Add a Project" />
        </div>
      )}
      {projects.map((p, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Project {i + 1}</span>
            <DelBtn onClick={() => setProjects(pr => pr.filter((_, j) => j !== i))} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Project Name *"><input className={inp} value={p.title} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, title: ev.target.value } : x))} placeholder="My SaaS App" /></Field>
            <Field label="URL / Link"><input className={inp} value={p.url} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, url: ev.target.value } : x))} placeholder="https://myapp.com" /></Field>
          </div>
          <Field label="Description" className="mt-4">
            <textarea className={ta} rows={2} value={p.description}
              onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Brief description of what the project does and your role." />
          </Field>
          <Field label="Technologies (comma-separated)" className="mt-4">
            <input className={inp} value={p.tech} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, tech: ev.target.value } : x))} placeholder="Next.js, Stripe, Supabase" />
          </Field>
        </div>
      ))}
      {projects.length > 0 && (
        <AddBtn onClick={() => setProjects(pr => [...pr, { title: "", description: "", tech: "", url: "" }])} label="Add Another Project" />
      )}
    </div>,

    // ── Step 5: Certifications (optional) ─────────────────────────────────────
    <div key="certs" className="space-y-4">
      <p className="text-slate-500 text-sm">Optional — list any certifications, courses, or professional qualifications.</p>
      {certs.length === 0 && (
        <div className={`${card} text-center py-8`}>
          <p className="text-slate-500 text-sm mb-3">No certifications added yet</p>
          <AddBtn onClick={() => setCerts([{ name: "", issuer: "", year: "" }])} label="Add a Certification" />
        </div>
      )}
      {certs.map((c, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Certification {i + 1}</span>
            <DelBtn onClick={() => setCerts(cs => cs.filter((_, j) => j !== i))} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Certificate Name *" className="sm:col-span-2"><input className={inp} value={c.name} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, name: ev.target.value } : x))} placeholder="AWS Solutions Architect" /></Field>
            <Field label="Year"><input className={inp} value={c.year} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, year: ev.target.value } : x))} placeholder="2024" /></Field>
            <Field label="Issuer" className="sm:col-span-3"><input className={inp} value={c.issuer} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, issuer: ev.target.value } : x))} placeholder="Amazon Web Services" /></Field>
          </div>
        </div>
      ))}
      {certs.length > 0 && (
        <AddBtn onClick={() => setCerts(cs => [...cs, { name: "", issuer: "", year: "" }])} label="Add Another Certification" />
      )}
    </div>,

    // ── Step 6: Choose Format ─────────────────────────────────────────────────
    <div key="format" className="space-y-4">
      <p className="text-slate-400 text-sm text-center">Select a format — your CV generates instantly as a downloadable PDF.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CV_FORMATS.map(fmt => (
          <button key={fmt.id} type="button" onClick={() => generate(fmt.id)}
            className="text-left p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-500/[0.06] transition-all group">
            <div className="text-2xl mb-2 leading-none">{fmt.flag}</div>
            <div className="text-white text-sm font-semibold group-hover:text-indigo-300 transition-colors leading-tight mb-0.5">{fmt.name}</div>
            <div className="text-indigo-400/70 text-xs mb-1.5">{fmt.region}</div>
            <div className="text-slate-600 text-xs leading-relaxed">{fmt.desc}</div>
            {fmt.photo && <div className="mt-2 text-xs text-slate-600">📷 Includes photo</div>}
          </button>
        ))}
      </div>
    </div>,
  ];

  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  function canProceed() {
    if (step === 0) return personal.name.trim() && personal.title.trim() && personal.email.trim() && personal.bio.trim();
    if (step === 1) return work.some(e => e.title.trim());
    if (step === 2) return edu.some(e => e.degree.trim());
    if (step === 3) return skills.some(s => s.category.trim() && s.items.trim());
    return true;
  }

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">CV Builder</span>
          </div>
          <span className="text-slate-500 text-sm">Step {step + 1} of {STEPS.length}</span>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1 rounded-full transition-colors ${i <= step ? "bg-indigo-500" : "bg-white/10"}`} />
                <div className={`text-xs mt-1.5 text-center hidden sm:block truncate transition-colors ${i === step ? "text-indigo-400" : i < step ? "text-slate-500" : "text-slate-700"}`}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-28">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{STEPS[step]}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {step === 0 && "Start with your contact details and professional summary."}
            {step === 1 && "Add your work history. Include your most recent position first."}
            {step === 2 && "List your educational background, most recent first."}
            {step === 3 && "Group your skills by category so they display clearly in your CV."}
            {step === 4 && "Add any notable projects you'd like to highlight."}
            {step === 5 && "List any certifications or professional courses."}
            {step === 6 && "Choose your CV style — a PDF will open in a new tab."}
          </p>
        </div>

        {stepContent[step]}
      </div>

      {/* Navigation */}
      {!isLast && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#0d1117]/95 backdrop-blur border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            {!isFirst ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {(step === 4 || step === 5) && (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  className="px-4 py-2.5 rounded-lg text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  Skip
                </button>
              )}
              <button type="button" onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
                {step === STEPS.length - 2 ? "Choose Format" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
