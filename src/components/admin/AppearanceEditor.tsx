"use client";

import { useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { Check, Moon, Sun } from "lucide-react";
import { saveTheme } from "@/lib/actions";
import { THEMES } from "@/lib/themes";
import { AdminFormWrapper, SaveButton } from "./AdminUI";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AppearanceEditor({
  initialColorScheme,
  initialMode,
}: {
  initialColorScheme: string;
  initialMode: "dark" | "light";
}) {
  const { theme: activeMode, setTheme: setMode } = useTheme();
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  function previewColorScheme(scheme: string) {
    const el = document.documentElement;
    const existing = Array.from(el.classList).find((c) => c.startsWith("theme-"));
    if (existing) el.classList.remove(existing);
    el.classList.add(`theme-${scheme}`);
    setColorScheme(scheme);
  }

  function handleSave() {
    const mode = (activeMode ?? initialMode) as "dark" | "light";
    startTransition(async () => {
      await saveTheme({ colorScheme, mode });
      toast.success("Appearance saved! Color theme applies site-wide after auto-deploy (~1 min).");
    });
  }

  const currentMode = mounted ? (activeMode ?? initialMode) : initialMode;

  return (
    <AdminFormWrapper title="Appearance">
      {/* Color Theme */}
      <div className="space-y-3">
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Color Theme</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const active = colorScheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => previewColorScheme(t.id)}
                className={cn(
                  "relative rounded-xl overflow-hidden border transition-all text-left group",
                  active
                    ? "border-indigo-500/60 ring-1 ring-indigo-500/30"
                    : "border-white/10 hover:border-white/25"
                )}
              >
                {/* Gradient preview band */}
                <div className="h-9 w-full" style={{ background: t.gradient }} />
                <div className="px-3 py-2.5 flex items-center justify-between bg-white/3 group-hover:bg-white/5 transition-colors">
                  <span className="text-xs font-medium text-slate-300">{t.name}</span>
                  {active && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display Mode */}
      <div className="space-y-3">
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Display Mode</div>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((m) => {
            const active = currentMode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  active
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                    : "bg-white/3 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                )}
              >
                {m === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {m === "dark" ? "Dark" : "Light"}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-600">
          Mode applies instantly. Color theme persists for all visitors after auto-deploy.
        </p>
      </div>

      <SaveButton onClick={handleSave} isPending={isPending} />
    </AdminFormWrapper>
  );
}
