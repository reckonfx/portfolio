"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

// ── Context ───────────────────────────────────────────────────────────────────

interface ResumeModalCtx {
  openModal: () => void;
}

const Ctx = createContext<ResumeModalCtx>({ openModal: () => {} });

export function useResumeModal() {
  return useContext(Ctx);
}

// ── Format definitions ────────────────────────────────────────────────────────

const FORMATS = [
  {
    id: "gulf",
    name: "Gulf CV",
    flag: "🇦🇪",
    region: "GCC / Gulf",
    description: "Standard Gulf format with photo, personal details, navy design",
    photo: true,
  },
  {
    id: "saudi",
    name: "Saudi CV",
    flag: "🇸🇦",
    region: "Saudi Arabia",
    description: "Saudi-style with photo, religion & nationality fields, green theme",
    photo: true,
  },
  {
    id: "emirati",
    name: "Emirati CV",
    flag: "🇦🇪",
    region: "UAE",
    description: "UAE format with dark sidebar, gold accents, photo panel",
    photo: true,
  },
  {
    id: "europass",
    name: "Europass CV",
    flag: "🇪🇺",
    region: "Europe",
    description: "Official EU standardised format with blue header and date-based layout",
    photo: true,
  },
  {
    id: "usa",
    name: "USA Resume",
    flag: "🇺🇸",
    region: "United States",
    description: "American style — no photo, achievement bullets, clean minimal layout",
    photo: false,
  },
  {
    id: "canada",
    name: "Canadian CV",
    flag: "🇨🇦",
    region: "Canada",
    description: "Canadian format with competencies grid and red accent theme",
    photo: false,
  },
  {
    id: "pakIndia",
    name: "Pakistan / India CV",
    flag: "🇵🇰",
    region: "Pakistan · India · Diaspora",
    description: "South Asian format with personal details grid, career objective, declaration, and references",
    photo: true,
  },
];

// ── Provider (holds state + renders modal) ────────────────────────────────────

export function ResumeModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const modalBg = isLight ? "#ffffff" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
  const cardBorderDefault = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const cardBgDefault = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)";
  const headingColor = isLight ? "#0f172a" : "#ffffff";
  const subTextColor = isLight ? "#475569" : "#94a3b8";
  const mutedColor = isLight ? "#64748b" : "#475569";
  const dimColor = isLight ? "#94a3b8" : "#4b5563";

  function openModal() { setOpen(true); }

  function download(format: string) {
    if (loading) return;
    setLoading(format);
    window.open(`/cv-preview?format=${format}`, "_blank");
    setTimeout(() => { setLoading(null); setOpen(false); }, 800);
  }

  return (
    <Ctx.Provider value={{ openModal }}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: modalBg, border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-start justify-between px-6 pt-6 pb-4"
                style={{ borderBottom: `1px solid ${borderColor}` }}>
                <div>
                  <h2 className="font-bold text-lg" style={{ color: headingColor }}>Download CV</h2>
                  <p className="text-sm mt-0.5" style={{ color: subTextColor }}>
                    Choose a format — your data fills in automatically
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="transition-colors mt-0.5 hover:text-indigo-400"
                  style={{ color: mutedColor }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 grid grid-cols-2 gap-3">
                {FORMATS.map((fmt) => {
                  const isLoading = loading === fmt.id;
                  return (
                    <motion.button
                      key={fmt.id}
                      onClick={() => download(fmt.id)}
                      disabled={!!loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="text-left p-4 rounded-xl border transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderColor: isLoading ? "#6366f1" : cardBorderDefault,
                        background: isLoading ? "rgba(99,102,241,0.1)" : cardBgDefault,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl leading-none">{fmt.flag}</span>
                        {isLoading && (
                          <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                        )}
                      </div>
                      <div className="text-sm font-semibold group-hover:text-indigo-500 transition-colors"
                        style={{ color: headingColor }}>
                        {fmt.name}
                      </div>
                      <div className="text-xs mt-0.5 mb-2 font-medium" style={{ color: mutedColor }}>
                        {fmt.region}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: dimColor }}>
                        {fmt.description}
                      </div>
                      {fmt.photo && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-indigo-400/70">
                          <span>📷</span>
                          <span>Includes photo</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="px-6 pb-5 text-xs text-center" style={{ color: dimColor }}>
                PDF is generated live from your portfolio data
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
