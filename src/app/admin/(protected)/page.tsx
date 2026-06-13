import Link from "next/link";
import { readData } from "@/lib/cms";
import { User, FolderOpen, Layers, Briefcase, Star, Clock, Award, ArrowRight, ExternalLink } from "lucide-react";
import { AppearanceEditor } from "@/components/admin/AppearanceEditor";

const sections = [
  { href: "/admin/personal", label: "Personal Info", icon: User, description: "Name, bio, contact, social links", color: "#818cf8" },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen, description: "Add, edit, and remove projects", color: "#60a5fa" },
  { href: "/admin/stack", label: "Tech Stack", icon: Layers, description: "Skills, categories, proficiency", color: "#a78bfa" },
  { href: "/admin/services", label: "Services", icon: Briefcase, description: "Service offerings and pricing", color: "#34d399" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star, description: "Client reviews and ratings", color: "#f59e0b" },
  { href: "/admin/experience", label: "Experience", icon: Clock, description: "Work history and education", color: "#f472b6" },
  { href: "/admin/certifications", label: "Certifications", icon: Award, description: "Professional certifications", color: "#fb923c" },
];

export default function AdminDashboard() {
  const data = readData();
  const siteTheme = data.theme;

  const stats = [
    { label: "Projects", value: data.projects.length },
    { label: "Tech Skills", value: data.techStack.reduce((a, c) => a + c.items.length, 0) },
    { label: "Services", value: data.services.length },
    { label: "Testimonials", value: data.testimonials.length },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your portfolio content</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm transition-all">
            <ExternalLink className="w-3.5 h-3.5" />View Site
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sections grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}
              className="group bg-white/3 border border-white/8 rounded-xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}>
                  <Icon className="w-4 h-4" style={{ color: section.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-white font-medium mb-1">{section.label}</h3>
              <p className="text-slate-500 text-xs">{section.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Appearance */}
      <div className="mt-8">
        <AppearanceEditor
          initialColorScheme={siteTheme?.colorScheme ?? "indigo-violet"}
          initialMode={(siteTheme?.mode ?? "dark") as "dark" | "light"}
          initialCustomColor={siteTheme?.customColor}
        />
      </div>
    </div>
  );
}
