"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, Lock, ChevronRight, Search, X, Globe, Tag } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Project } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string }> = {
  Live: { label: "Live", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  "In Development": { label: "In Dev", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  Private: { label: "Private", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

function ProjectMediaBanner({ project, className }: { project: Project; className?: string }) {
  const emoji = project.category === "SaaS" ? "🚀" : project.category === "Web3" ? "⛓️" :
    project.category === "Template" ? "📦" : project.category === "AI Tool" ? "🤖" :
    project.category === "Dev Tool" ? "🛠️" : "💼";

  if (project.video) {
    return (
      <div className={cn("relative overflow-hidden bg-black", className)}>
        <video src={project.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
      </div>
    );
  }
  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e]/80 to-transparent" />
      </div>
    );
  }
  return (
    <div className={cn("relative bg-gradient-to-br from-indigo-900/30 to-violet-900/30 flex items-center justify-center", className)}>
      <div className="text-5xl">{emoji}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e]/80 to-transparent" />
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = statusConfig[project.status] ?? statusConfig["Private"];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl glass-strong rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="h-56 relative">
          <ProjectMediaBanner project={project} className="h-full w-full" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border", status.color)}>{status.label}</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-slate-400 text-xs">{project.category}</span>
            {project.featured && <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">Featured</span>}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.longDescription || project.description}</p>
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(project.metrics).map(([key, val]) => (
                <div key={key} className="glass rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-white">{val}</div>
                  <div className="text-xs text-slate-500 capitalize">{key}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs text-slate-500">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">
                <GithubIcon className="w-4 h-4" />
                GitHub
                {project.stars > 0 && <span className="text-slate-400">· {project.stars}</span>}
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm">
                <Globe className="w-4 h-4" />Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const status = statusConfig[project.status] ?? statusConfig["Private"];
  const hasMetrics = project.metrics && Object.keys(project.metrics).length > 0;
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className="group glass rounded-2xl overflow-hidden cursor-pointer border border-white/6 hover:border-indigo-500/25 hover:shadow-[0_0_40px_rgba(99,102,241,0.08)] transition-all duration-350"
      onClick={onClick}>

      {/* Image banner with overlay reveal on hover */}
      <div className="h-44 relative overflow-hidden">
        <ProjectMediaBanner project={project} className="h-full w-full absolute inset-0 group-hover:scale-[1.04] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141517]/90 via-[#141517]/20 to-transparent" />

        {/* Hover overlay: metrics or "View Case Study" */}
        <div className="absolute inset-0 bg-indigo-950/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {hasMetrics ? (
            <div className="flex gap-4">
              {Object.entries(project.metrics!).slice(0, 3).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-xl font-bold text-white">{val}</div>
                  <div className="text-[10px] text-indigo-300 capitalize">{key}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              View Case Study <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Badges */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <Star className="w-3 h-3 fill-amber-400" /> Featured
          </div>
        )}
        <div className={cn("absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border", status.color)}>
          {status.label}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs text-indigo-400 font-semibold tracking-wide uppercase">{project.category}</span>
          <span className="text-xs text-slate-600">{formatDate(project.date)}</span>
        </div>
        <h3 className="text-white font-semibold text-[15px] mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-lg bg-indigo-500/8 border border-indigo-500/15 text-indigo-300/80 text-xs">{t}</span>
          ))}
          {project.tech.length > 4 && <span className="px-2 py-0.5 text-xs text-slate-500">+{project.tech.length - 4}</span>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/6 transition-colors">
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/6 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {!project.github && !project.demo && (
              <span className="flex items-center gap-1 text-slate-600 text-xs"><Lock className="w-3 h-3" /> Private</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-indigo-400 text-xs font-semibold">
            View Case Study
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects({ data }: { data: Project[] }) {
  const allCategories = ["All", ...Array.from(new Set(data.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = data.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute inset-0" style={{ background: "var(--theme-bg)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Real Impact" title="Real Solutions. " highlight="Real Impact."
          description="Products, platforms, and tools built to solve real business problems — from idea to deployed product." />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass border-transparent focus:border-indigo-500/30 text-slate-300 text-sm placeholder:text-slate-600 outline-none transition-colors" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-slate-500 hover:text-white" /></button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  activeCategory === cat ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300" : "glass text-slate-400 hover:text-white hover:border-white/10")}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-500 text-sm mb-6">{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && <div className="text-center py-20 text-slate-500">No projects match your filters.</div>}
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
}
