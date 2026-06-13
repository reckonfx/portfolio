"use client";

import { useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { Check, Moon, Sun } from "lucide-react";
import { saveTheme } from "@/lib/actions";
import { THEMES, PALETTE, THEME_VAR_NAMES, buildThemeCSSVars } from "@/lib/themes";
import { AdminFormWrapper, SaveButton } from "./AdminUI";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AppearanceEditor({
  initialColorScheme,
  initialMode,
  initialCustomColor,
}: {
  initialColorScheme: string;
  initialMode: "dark" | "light";
  initialCustomColor?: string;
}) {
  const { theme: activeMode, setTheme: setMode } = useTheme();
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const [customColor, setCustomColor] = useState<string | undefined>(initialCustomColor);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  function clearCustomVars() {
    const el = document.documentElement;
    for (const v of THEME_VAR_NAMES) el.style.removeProperty(v);
  }

  function previewColorScheme(scheme: string) {
    clearCustomVars();
    const el = document.documentElement;
    const existing = Array.from(el.classList).find((c) => c.startsWith("theme-"));
    if (existing) el.classList.remove(existing);
    el.classList.add(`theme-${scheme}`);
    setColorScheme(scheme);
    setCustomColor(undefined);
  }

  function applyCustomColor(hex: string) {
    const el = document.documentElement;
    const existing = Array.from(el.classList).find((c) => c.startsWith("theme-"));
    if (existing) el.classList.remove(existing);
    const vars = buildThemeCSSVars(hex);
    for (const [k, v] of Object.entries(vars)) {
      el.style.setProperty(k, v);
    }
    setColorScheme("custom");
    setCustomColor(hex);
  }

  function handleSave() {
    const mode = (activeMode ?? initialMode) as "dark" | "light";
    startTransition(async () => {
      await saveTheme({ colorScheme, mode, customColor });
      toast.success("Appearance saved! Changes apply site-wide after auto-deploy (~1 min).");
    });
  }

  const currentMode = mounted ? (activeMode ?? initialMode) : initialMode;

  return (
    <AdminFormWrapper title="Appearance">
      {/* Color Theme */}
      <div className="space-y-4">
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Color Theme</div>

        {/* Presets */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Presets</div>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => {
              const active = colorScheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => previewColorScheme(t.id)}
                  className={cn(
                    "relative rounded-lg overflow-hidden border transition-all text-left group",
                    active
                      ? "border-indigo-500/60 ring-1 ring-indigo-500/30"
                      : "border-white/10 hover:border-white/25"
                  )}
                >
                  <div className="h-7 w-full" style={{ background: t.gradient }} />
                  <div className="px-2 py-1.5 flex items-center justify-between bg-white/3 group-hover:bg-white/5 transition-colors">
                    <span className="text-xs font-medium text-slate-300 truncate">{t.name}</span>
                    {active && <Check className="w-3 h-3 text-indigo-400 flex-shrink-0 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Palette */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Custom Color</div>
          <div className="grid grid-cols-8 gap-1.5 mb-3">
            {PALETTE.map((color) => {
              const active =
                colorScheme === "custom" &&
                customColor?.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={() => applyCustomColor(color)}
                  title={color}
                  className={cn(
                    "w-full aspect-square rounded-md border-2 transition-all hover:scale-110",
                    active ? "border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>

          {/* Native color picker */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className="w-8 h-8 rounded-lg border-2 border-white/20 overflow-hidden relative hover:border-white/50 transition-colors"
                style={{
                  backgroundColor:
                    colorScheme === "custom" && customColor ? customColor : "#6366f1",
                }}
              >
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={
                    colorScheme === "custom" && customColor ? customColor : "#6366f1"
                  }
                  onChange={(e) => applyCustomColor(e.target.value)}
                />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                Pick any shade
              </span>
            </label>
            {colorScheme === "custom" && customColor && (
              <span className="text-xs text-slate-500 font-mono">
                {customColor.toUpperCase()}
              </span>
            )}
          </div>
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
