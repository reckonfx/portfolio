"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Hash, Mail, Download, ExternalLink } from "lucide-react";
import { useResumeModal } from "@/components/ResumeModalProvider";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

interface CommandPaletteProps {
  email: string;
  resume: string;
  github: string;
}

export function CommandPalette({ email, resume: _resume, github }: CommandPaletteProps) {
  const { openModal } = useResumeModal();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    ...navLinks.map((link) => ({
      label: link.label,
      description: `Navigate to ${link.label}`,
      icon: Hash,
      action: () => document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" }),
    })),
    { label: "Download Resume", description: "Choose CV format and download", icon: Download, action: () => { setOpen(false); openModal(); } },
    { label: "Send Email", description: email, icon: Mail, action: () => window.open(`mailto:${email}`) },
    { label: "GitHub Profile", description: "Open GitHub", icon: ExternalLink, action: () => window.open(github, "_blank") },
  ];

  const filtered = commands.filter((c) =>
    !query || c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((v) => !v); setQuery(""); setSelected(0); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const handleSelect = (cmd: (typeof commands)[0]) => { cmd.action(); setOpen(false); setQuery(""); };

  return (
    <>
      <motion.button onClick={() => setOpen(true)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-xl glass-strong text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-xl text-sm">
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Command</span>
        <kbd className="px-1.5 py-0.5 rounded text-xs bg-white/5 border border-white/10">⌘K</kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.97, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }} transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg glass-strong rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
                <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input ref={inputRef} type="text" placeholder="Search commands..." value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
                    if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
                    if (e.key === "Enter" && filtered[selected]) handleSelect(filtered[selected]);
                  }}
                  className="flex-1 bg-transparent text-white placeholder:text-slate-600 outline-none text-sm" />
              </div>
              <div className="py-2 max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-600 text-sm">No results found</div>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon;
                    return (
                      <button key={cmd.label} onClick={() => handleSelect(cmd)} onMouseEnter={() => setSelected(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === selected ? "bg-white/5" : "hover:bg-white/3"}`}>
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium">{cmd.label}</div>
                          <div className="text-slate-500 text-xs truncate">{cmd.description}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-xs text-slate-600">
                <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
