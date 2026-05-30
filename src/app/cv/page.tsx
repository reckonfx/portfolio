"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2, User, Upload, X, ChevronRight, ChevronLeft, Sparkles, Eye, FileText, Download } from "lucide-react";
import { CVPreview } from "@/components/CVPreview";
import type { PortfolioData, Experience, Project, Certification, TechCategory } from "@/lib/types";

// ─── Internal form types ────────────────────────────────────────────────────────

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

// ─── Constants ──────────────────────────────────────────────────────────────────

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
  { id: "academic",     name: "Academic CV",       flag: "🎓",  region: "Universities",          photo: false, desc: "Research, publications, no page limit" },
];

// ─── Template browser metadata ──────────────────────────────────────────────────

const FORMAT_HEADER_COLORS: Record<string, string> = {
  gulf: "#0a3d6b", saudi: "#00693e", emirati: "#1a1a2e",
  europass: "#003399", usa: "#1e2433", canada: "#c41a1a",
  pakIndia: "#1a4731", uk: "#1c3d5a", anz: "#004831",
  lebenslauf: "#2c3e50", "lebenslauf-de": "#2c3e50", academic: "#1a1a2a",
};

const FORMAT_ATS: Record<string, { label: string; color: string }> = {
  usa:            { label: "ATS Optimized",  color: "#10b981" },
  canada:         { label: "ATS Ready",      color: "#10b981" },
  uk:             { label: "ATS Ready",      color: "#10b981" },
  anz:            { label: "ATS Ready",      color: "#10b981" },
  gulf:           { label: "ATS Friendly",   color: "#10b981" },
  europass:       { label: "EU Standard",    color: "#3b82f6" },
  lebenslauf:     { label: "DE Standard",    color: "#8b5cf6" },
  "lebenslauf-de":{ label: "DE Standard",    color: "#8b5cf6" },
  saudi:          { label: "Regional",       color: "#f59e0b" },
  emirati:        { label: "Regional",       color: "#f59e0b" },
  pakIndia:       { label: "Regional",       color: "#f59e0b" },
  academic:       { label: "Academic",       color: "#06b6d4" },
};

const FORMAT_CATEGORIES: Record<string, string[]> = {
  Modern:   ["usa", "canada", "uk", "anz"],
  Regional: ["gulf", "saudi", "emirati", "pakIndia"],
  European: ["europass", "lebenslauf", "lebenslauf-de"],
  Academic: ["academic"],
};

function FormatThumb({ fmt }: { fmt: typeof CV_FORMATS[0] }) {
  const hc = FORMAT_HEADER_COLORS[fmt.id] ?? "#1e2433";
  return (
    <div className="w-full aspect-[0.707/1] rounded-md overflow-hidden bg-white shadow-sm border border-black/10 relative flex-shrink-0">
      {/* Header block */}
      <div style={{ background: hc }} className="h-[26%] w-full relative">
        <div className="p-1.5 space-y-0.5">
          <div className="h-1 w-9 bg-white/75 rounded-sm" />
          <div className="h-0.5 w-6 bg-white/40 rounded-sm" />
          <div className="h-0.5 w-12 bg-white/25 rounded-sm" />
        </div>
        {fmt.photo && (
          <div className="absolute bottom-0 right-2 translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 border-2 border-white" />
        )}
      </div>
      {/* Body lines */}
      <div className="p-1.5 pt-2 space-y-[3px]">
        {[85, 60, 95, 50, 78, 64, 88, 45, 70].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, opacity: i % 3 === 0 ? 0.5 : 0.22 }}
            className="h-[2px] bg-gray-700 rounded-sm" />
        ))}
      </div>
    </div>
  );
}

// ─── Styling helpers ────────────────────────────────────────────────────────────

const inp = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-700/80 transition-colors cursor-text";
const inpStyle = { color: "#e2e8f0", caretColor: "#e2e8f0" };
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

// ─── Build PortfolioData from form state ────────────────────────────────────────

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

// ─── Live Preview Panel ─────────────────────────────────────────────────────────

function PreviewPanel({
  data, format, onFormatChange, onGenerate,
}: {
  data: PortfolioData;
  format: string;
  onFormatChange: (f: string) => void;
  onGenerate: (f: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.48);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width - 32; // 16px padding each side
      setScale(Math.min(1, Math.max(0.3, w / 794)));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scaledH = Math.round(1123 * scale);
  const fmt = CV_FORMATS.find(f => f.id === format);

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-white text-sm font-semibold">Live Preview</span>
          <span className="hidden xl:inline text-slate-600 text-xs">· updates as you type</span>
        </div>
        <button
          onClick={() => onGenerate(format)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* Format selector */}
      <div className="px-4 py-2.5 border-b border-white/4 flex-shrink-0">
        <select
          value={format}
          onChange={e => onFormatChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          style={{ color: "#e2e8f0" }}
        >
          {CV_FORMATS.map(f => (
            <option key={f.id} value={f.id}>{f.flag} {f.name} — {f.region}</option>
          ))}
        </select>
        {fmt && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span className="text-slate-500 text-xs">{fmt.desc}</span>
            {fmt.photo && <span className="text-slate-600 text-xs">· 📷 Photo included</span>}
          </div>
        )}
      </div>

      {/* Scaled CV preview */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <div
          style={{ height: `${scaledH}px`, position: "relative", overflow: "hidden" }}
          className="rounded-lg shadow-2xl border border-white/10"
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "794px",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <CVPreview data={data} format={format} previewOnly />
          </div>
        </div>
        <p className="text-slate-600 text-xs text-center mt-3">
          Click <strong className="text-slate-400">Download PDF</strong> for the full-quality file
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function CVBuilderPage() {
  const [step, setStep] = useState(0);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [selectedFormat, setSelectedFormat] = useState("usa");

  const [personal, setPersonal] = useState<PersonalForm>({
    name: "", title: "", bio: "", email: "", phone: "", location: "",
    website: "", linkedin: "", github: "",
    nationality: "", dateOfBirth: "", placeOfBirth: "",
    religion: "", maritalStatus: "", cnic: "",
  });
  const [avatar, setAvatar] = useState("");
  const [work, setWork] = useState<WorkEntry[]>([{ title: "", company: "", period: "", description: "", tech: "", type: "work" }]);
  const [edu, setEdu] = useState<EduEntry[]>([{ degree: "", institution: "", period: "", description: "" }]);
  const [skills, setSkills] = useState<SkillCat[]>([{ category: "", items: "" }]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [certs, setCerts] = useState<CertEntry[]>([]);
  const [showRegional, setShowRegional] = useState(false);
  const [templateCategory, setTemplateCategory] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const sp = (k: keyof PersonalForm) => (v: string) => setPersonal(p => ({ ...p, [k]: v }));

  // Build preview data reactively
  const previewData = useMemo(
    () => buildData(personal, avatar, work, edu, skills, projects, certs),
    [personal, avatar, work, edu, skills, projects, certs],
  );

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function generate(formatId: string) {
    const data = buildData(personal, avatar, work, edu, skills, projects, certs);
    try { localStorage.setItem("cv-builder-data", JSON.stringify(data)); } catch {}
    window.open(`/cv/preview?format=${formatId}`, "_blank");
  }

  function canProceed() {
    if (step === 0) return personal.name.trim() && personal.title.trim() && personal.email.trim() && personal.bio.trim();
    if (step === 1) return work.some(e => e.title.trim());
    if (step === 2) return edu.some(e => e.degree.trim());
    if (step === 3) return skills.some(s => s.category.trim() && s.items.trim());
    return true;
  }

  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  // ── Step content ──────────────────────────────────────────────────────────────

  const stepContent = [

    // Step 0: Personal Info
    <div key="personal" className="space-y-5">
      <div className={card}>
        <h3 className="text-white font-semibold mb-4">Profile Photo</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white/[0.04] border border-white/10 flex items-center justify-center">
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
          <div className="flex-1 w-full border-2 border-dashed border-white/10 rounded-xl p-4 sm:p-5 text-center hover:border-indigo-500/40 cursor-pointer transition-colors"
            onClick={() => fileRef.current?.click()}>
            <Upload className="w-5 h-5 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Click to upload photo</p>
            <p className="text-slate-600 text-xs mt-1">JPG, PNG, WebP — optional</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-white font-semibold mb-4">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name *"><input className={inp} style={inpStyle} value={personal.name} onChange={e => sp("name")(e.target.value)} placeholder="John Smith" /></Field>
          <Field label="Job Title / Profession *"><input className={inp} style={inpStyle} value={personal.title} onChange={e => sp("title")(e.target.value)} placeholder="Software Engineer" /></Field>
          <Field label="Email *"><input className={inp} style={inpStyle} type="email" value={personal.email} onChange={e => sp("email")(e.target.value)} placeholder="john@example.com" /></Field>
          <Field label="Phone *"><input className={inp} style={inpStyle} value={personal.phone} onChange={e => sp("phone")(e.target.value)} placeholder="+971 50 123 4567" /></Field>
          <Field label="Location *"><input className={inp} style={inpStyle} value={personal.location} onChange={e => sp("location")(e.target.value)} placeholder="Dubai, UAE" /></Field>
          <Field label="Website"><input className={inp} style={inpStyle} value={personal.website} onChange={e => sp("website")(e.target.value)} placeholder="https://yoursite.com" /></Field>
          <Field label="LinkedIn"><input className={inp} style={inpStyle} value={personal.linkedin} onChange={e => sp("linkedin")(e.target.value)} placeholder="linkedin.com/in/yourname" /></Field>
          <Field label="GitHub"><input className={inp} style={inpStyle} value={personal.github} onChange={e => sp("github")(e.target.value)} placeholder="github.com/yourname" /></Field>
        </div>
        <Field label="Professional Summary *" className="mt-4">
          <textarea className={ta} style={inpStyle} rows={4} value={personal.bio} onChange={e => sp("bio")(e.target.value)}
            placeholder="Write a 2-4 sentence professional summary..." />
        </Field>
      </div>

      <div className={card}>
        <button type="button" onClick={() => setShowRegional(v => !v)}
          className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors w-full text-left">
          <span className="text-indigo-400">+</span>
          <span>{showRegional ? "Hide" : "Add"} Regional Details</span>
          <span className="text-slate-600 text-xs ml-1 hidden sm:inline">(Nationality, DOB, Religion — for Gulf, German, South Asian CVs)</span>
        </button>
        {showRegional && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Nationality"><input className={inp} style={inpStyle} value={personal.nationality} onChange={e => sp("nationality")(e.target.value)} placeholder="Pakistani" /></Field>
            <Field label="Date of Birth"><input className={inp} style={inpStyle} value={personal.dateOfBirth} onChange={e => sp("dateOfBirth")(e.target.value)} placeholder="15 March 1990" /></Field>
            <Field label="Place of Birth"><input className={inp} style={inpStyle} value={personal.placeOfBirth} onChange={e => sp("placeOfBirth")(e.target.value)} placeholder="Karachi, Pakistan" /></Field>
            <Field label="Religion"><input className={inp} style={inpStyle} value={personal.religion} onChange={e => sp("religion")(e.target.value)} placeholder="Islam" /></Field>
            <Field label="Marital Status"><input className={inp} style={inpStyle} value={personal.maritalStatus} onChange={e => sp("maritalStatus")(e.target.value)} placeholder="Married" /></Field>
            <Field label="CNIC / National ID"><input className={inp} style={inpStyle} value={personal.cnic} onChange={e => sp("cnic")(e.target.value)} placeholder="42101-1234567-8" /></Field>
          </div>
        )}
      </div>
    </div>,

    // Step 1: Experience
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
                    className={`px-2.5 sm:px-3 py-1 text-xs transition-colors ${e.type === t ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                    <span className="sm:hidden">{t === "work" ? "Job" : "Freelance"}</span>
                    <span className="hidden sm:inline">{t === "work" ? "Employment" : "Self-Employed"}</span>
                  </button>
                ))}
              </div>
              {work.length > 1 && <DelBtn onClick={() => setWork(w => w.filter((_, j) => j !== i))} />}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job Title *"><input className={inp} style={inpStyle} value={e.title} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, title: ev.target.value } : x))} placeholder="Senior Developer" /></Field>
            <Field label="Company / Organization"><input className={inp} style={inpStyle} value={e.company} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, company: ev.target.value } : x))} placeholder="Acme Corp" /></Field>
            <Field label="Period" className="sm:col-span-2"><input className={inp} style={inpStyle} value={e.period} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} placeholder="Jan 2021 – Present" /></Field>
          </div>
          <Field label="Description / Responsibilities" className="mt-4">
            <textarea className={ta} style={inpStyle} rows={3} value={e.description}
              onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Describe key responsibilities and achievements..." />
          </Field>
          <Field label="Technologies Used (comma-separated)" className="mt-4">
            <input className={inp} style={inpStyle} value={e.tech} onChange={ev => setWork(w => w.map((x, j) => j === i ? { ...x, tech: ev.target.value } : x))} placeholder="React, Node.js, PostgreSQL, Docker" />
          </Field>
        </div>
      ))}
      <AddBtn onClick={() => setWork(w => [...w, { title: "", company: "", period: "", description: "", tech: "", type: "work" }])} label="Add Another Experience" />
    </div>,

    // Step 2: Education
    <div key="edu" className="space-y-4">
      {edu.map((e, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Education {i + 1}</span>
            {edu.length > 1 && <DelBtn onClick={() => setEdu(d => d.filter((_, j) => j !== i))} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Degree / Qualification *"><input className={inp} style={inpStyle} value={e.degree} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, degree: ev.target.value } : x))} placeholder="BSc Computer Science" /></Field>
            <Field label="Institution *"><input className={inp} style={inpStyle} value={e.institution} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, institution: ev.target.value } : x))} placeholder="University of London" /></Field>
            <Field label="Period" className="sm:col-span-2"><input className={inp} style={inpStyle} value={e.period} onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, period: ev.target.value } : x))} placeholder="2016 – 2020" /></Field>
          </div>
          <Field label="Description / Achievements" className="mt-4">
            <textarea className={ta} style={inpStyle} rows={2} value={e.description}
              onChange={ev => setEdu(d => d.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Graduated with honours. CGPA: 3.8/4.0" />
          </Field>
        </div>
      ))}
      <AddBtn onClick={() => setEdu(d => [...d, { degree: "", institution: "", period: "", description: "" }])} label="Add Another Education" />
    </div>,

    // Step 3: Skills
    <div key="skills" className="space-y-4">
      <p className="text-slate-500 text-sm">Group your skills into categories.</p>
      {skills.map((s, i) => (
        <div key={i} className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium text-sm">Skill Category {i + 1}</span>
            {skills.length > 1 && <DelBtn onClick={() => setSkills(sk => sk.filter((_, j) => j !== i))} />}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category Name *">
              <input className={inp} style={inpStyle} value={s.category} onChange={ev => setSkills(sk => sk.map((x, j) => j === i ? { ...x, category: ev.target.value } : x))} placeholder="Frontend" />
            </Field>
            <Field label="Skills (comma-separated) *" className="sm:col-span-2">
              <input className={inp} style={inpStyle} value={s.items} onChange={ev => setSkills(sk => sk.map((x, j) => j === i ? { ...x, items: ev.target.value } : x))} placeholder="React, TypeScript, Next.js" />
            </Field>
          </div>
        </div>
      ))}
      <AddBtn onClick={() => setSkills(sk => [...sk, { category: "", items: "" }])} label="Add Another Category" />
    </div>,

    // Step 4: Projects
    <div key="projects" className="space-y-4">
      <p className="text-slate-500 text-sm">Optional — add notable projects.</p>
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
            <Field label="Project Name *"><input className={inp} style={inpStyle} value={p.title} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, title: ev.target.value } : x))} placeholder="My SaaS App" /></Field>
            <Field label="URL / Link"><input className={inp} style={inpStyle} value={p.url} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, url: ev.target.value } : x))} placeholder="https://myapp.com" /></Field>
          </div>
          <Field label="Description" className="mt-4">
            <textarea className={ta} style={inpStyle} rows={2} value={p.description}
              onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, description: ev.target.value } : x))}
              placeholder="Brief description of what the project does." />
          </Field>
          <Field label="Technologies (comma-separated)" className="mt-4">
            <input className={inp} style={inpStyle} value={p.tech} onChange={ev => setProjects(pr => pr.map((x, j) => j === i ? { ...x, tech: ev.target.value } : x))} placeholder="Next.js, Stripe, Supabase" />
          </Field>
        </div>
      ))}
      {projects.length > 0 && (
        <AddBtn onClick={() => setProjects(pr => [...pr, { title: "", description: "", tech: "", url: "" }])} label="Add Another Project" />
      )}
    </div>,

    // Step 5: Certifications
    <div key="certs" className="space-y-4">
      <p className="text-slate-500 text-sm">Optional — list certifications or professional qualifications.</p>
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
            <Field label="Certificate Name *" className="sm:col-span-2"><input className={inp} style={inpStyle} value={c.name} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, name: ev.target.value } : x))} placeholder="AWS Solutions Architect" /></Field>
            <Field label="Year"><input className={inp} style={inpStyle} value={c.year} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, year: ev.target.value } : x))} placeholder="2024" /></Field>
            <Field label="Issuer" className="sm:col-span-3"><input className={inp} style={inpStyle} value={c.issuer} onChange={ev => setCerts(cs => cs.map((x, j) => j === i ? { ...x, issuer: ev.target.value } : x))} placeholder="Amazon Web Services" /></Field>
          </div>
        </div>
      ))}
      {certs.length > 0 && (
        <AddBtn onClick={() => setCerts(cs => [...cs, { name: "", issuer: "", year: "" }])} label="Add Another Certification" />
      )}
    </div>,

    // Step 6: Template browser
    <div key="format" className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Select a template — the <strong className="text-white">Live Preview</strong> updates instantly.
          <span className="lg:hidden"> Tap <strong className="text-indigo-300">Preview</strong> above to see it.</span>
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...Object.keys(FORMAT_CATEGORIES)].map(cat => (
          <button key={cat} type="button" onClick={() => setTemplateCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              templateCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Template cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CV_FORMATS
          .filter(fmt =>
            templateCategory === "All" ||
            (FORMAT_CATEGORIES[templateCategory] ?? []).includes(fmt.id)
          )
          .map(fmt => {
            const ats = FORMAT_ATS[fmt.id];
            const isSelected = selectedFormat === fmt.id;
            return (
              <button key={fmt.id} type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`group relative text-left rounded-xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "border-indigo-500/70 bg-indigo-500/8 shadow-[0_0_24px_rgba(99,102,241,0.15)]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="p-2.5 pb-0">
                  <FormatThumb fmt={fmt} />
                </div>

                {/* Info */}
                <div className="p-2.5 pt-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-sm leading-none">{fmt.flag}</span>
                    <span className={`text-xs font-semibold leading-tight transition-colors ${isSelected ? "text-indigo-300" : "text-white group-hover:text-indigo-300"}`}>
                      {fmt.name}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[10px] mb-1.5 leading-tight">{fmt.region}</div>
                  {ats && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: ats.color }} />
                      <span className="text-[10px] font-medium" style={{ color: ats.color }}>{ats.label}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
      </div>

      {/* Generate CTA */}
      {selectedFormat && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="button" onClick={() => generate(selectedFormat)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all">
            <Download className="w-4 h-4" />
            Download {CV_FORMATS.find(f => f.id === selectedFormat)?.name ?? "CV"} as PDF
          </button>
        </div>
      )}
    </div>,
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="cv-builder min-h-screen bg-[#0a0b0e] text-white flex flex-col" style={{ colorScheme: "dark" }}>
      <style>{`
        .cv-builder input,
        .cv-builder textarea,
        .cv-builder select {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          caret-color: #e2e8f0 !important;
        }
        .cv-builder input:focus,
        .cv-builder textarea:focus {
          background-color: #263347 !important;
          outline: none;
        }
        .cv-builder input::placeholder,
        .cv-builder textarea::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
        }
        .cv-builder select option {
          background-color: #1e293b;
          color: #e2e8f0;
        }
      `}</style>

      {/* ── Header ── */}
      <header className="border-b border-white/[0.06] bg-[#0d1117]/90 backdrop-blur sticky top-0 z-30 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 lg:pr-0">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white text-sm">CV Builder</span>
          </div>

          {/* Mobile tabs: Form / Preview */}
          <div className="flex lg:hidden bg-white/5 rounded-lg p-0.5 border border-white/8">
            <button
              onClick={() => setMobileTab("form")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mobileTab === "form" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <FileText className="w-3.5 h-3.5" /> Form
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mobileTab === "preview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>

          {/* Step count (desktop) */}
          <span className="hidden lg:block text-slate-500 text-xs pr-4">{step + 1} / {STEPS.length}</span>
        </div>

        {/* Progress bar — form steps */}
        <div className={`px-4 pb-3 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          <div className="flex gap-1 lg:mr-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1 rounded-full transition-colors ${i <= step ? "bg-indigo-500" : "bg-white/10"}`} />
                <div className={`text-xs mt-1 text-center hidden sm:block truncate transition-colors ${i === step ? "text-indigo-400" : i < step ? "text-slate-500" : "text-slate-700"}`}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body: two-column on desktop ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left: Form panel */}
        <div className={`flex-1 overflow-y-auto ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 lg:pb-24">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">{STEPS[step]}</h2>
              <p className="text-slate-500 text-sm mt-1">
                {step === 0 && "Start with your contact details and professional summary."}
                {step === 1 && "Add your work history. Include your most recent position first."}
                {step === 2 && "List your educational background, most recent first."}
                {step === 3 && "Group your skills by category so they display clearly in your CV."}
                {step === 4 && "Add any notable projects you'd like to highlight."}
                {step === 5 && "List any certifications or professional courses."}
                {step === 6 && "Choose your CV format to generate and download your PDF."}
              </p>
            </div>
            {stepContent[step]}
          </div>
        </div>

        {/* Right: Live preview panel (desktop always / mobile when preview tab) */}
        <div className={`
          lg:w-[400px] xl:w-[440px] lg:border-l border-white/6 bg-[#090a0d] flex-shrink-0
          ${mobileTab === "preview" ? "flex flex-col flex-1" : "hidden lg:flex lg:flex-col"}
        `}>
          <PreviewPanel
            data={previewData}
            format={selectedFormat}
            onFormatChange={setSelectedFormat}
            onGenerate={generate}
          />
        </div>
      </div>

      {/* ── Fixed bottom nav (form mode only on mobile, always on desktop) ── */}
      {(mobileTab === "form" || true) && (
        <div className={`
          fixed bottom-0 left-0 z-20 bg-[#0d1117]/95 backdrop-blur border-t border-white/[0.06]
          right-0 lg:right-[400px] xl:right-[440px]
          ${mobileTab === "preview" ? "hidden lg:block" : ""}
        `}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {!isFirst ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {!isLast && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
