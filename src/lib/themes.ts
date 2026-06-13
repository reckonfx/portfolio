function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const toHex = (v: number) => Math.round(hue2rgb(p, q, v) * 255).toString(16).padStart(2, "0");
  return `#${toHex(h / 360 + 1 / 3)}${toHex(h / 360)}${toHex(h / 360 - 1 / 3)}`;
}

export function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export const THEME_VAR_NAMES = [
  "--color-indigo-300", "--color-indigo-400", "--color-indigo-500",
  "--color-indigo-600", "--color-indigo-700",
  "--color-violet-400", "--color-violet-500", "--color-violet-600",
  "--theme-glow", "--theme-glow-sm", "--theme-gradient",
  "--theme-gradient-alt", "--theme-scrollbar", "--theme-bg",
] as const;

export function buildThemeCSSVars(hex: string): Record<string, string> {
  const [h, s] = hexToHSL(hex);
  const sat = Math.max(s, 60);
  const vh = (h + 30) % 360;

  const c300 = hslToHex(h, Math.min(sat + 5, 95), 78);
  const c400 = hslToHex(h, Math.min(sat, 90), 65);
  const c500 = hslToHex(h, sat, 53);
  const c600 = hslToHex(h, sat, 43);
  const c700 = hslToHex(h, sat, 36);
  const v400 = hslToHex(vh, Math.min(sat, 90), 65);
  const v500 = hslToHex(vh, sat, 53);
  const v600 = hslToHex(vh, sat, 43);

  const r5 = parseInt(c500.slice(1, 3), 16);
  const g5 = parseInt(c500.slice(3, 5), 16);
  const b5 = parseInt(c500.slice(5, 7), 16);

  const bg = hslToHex(h, Math.min(Math.max(sat * 0.45, 20), 35), 10);

  return {
    "--color-indigo-300": c300,
    "--color-indigo-400": c400,
    "--color-indigo-500": c500,
    "--color-indigo-600": c600,
    "--color-indigo-700": c700,
    "--color-violet-400": v400,
    "--color-violet-500": v500,
    "--color-violet-600": v600,
    "--theme-glow": `rgba(${r5},${g5},${b5},0.2)`,
    "--theme-glow-sm": `rgba(${r5},${g5},${b5},0.1)`,
    "--theme-gradient": `linear-gradient(135deg,${c400} 0%,${v400} 50%,${c500} 100%)`,
    "--theme-gradient-alt": `linear-gradient(135deg,${c300} 0%,${c400} 50%,${v400} 100%)`,
    "--theme-scrollbar": c600,
    "--theme-bg": bg,
  };
}

export const PALETTE: string[] = [
  // Row 1 — cool spectrum light
  "#fb7185", "#f472b6", "#e879f9", "#c084fc", "#818cf8", "#60a5fa", "#38bdf8", "#22d3ee",
  // Row 2 — warm spectrum light
  "#2dd4bf", "#34d399", "#4ade80", "#a3e635", "#facc15", "#fbbf24", "#fb923c", "#f87171",
  // Row 3 — cool spectrum vivid
  "#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4",
  // Row 4 — warm spectrum vivid
  "#14b8a6", "#10b981", "#22c55e", "#84cc16", "#eab308", "#f59e0b", "#f97316", "#ef4444",
];

export interface ThemePreset {
  id: string;
  name: string;
  gradient: string;
  from: string;
  to: string;
}

export const THEMES: ThemePreset[] = [
  {
    id: "indigo-violet",
    name: "Indigo / Violet",
    from: "#6366f1",
    to: "#8b5cf6",
    gradient: "linear-gradient(135deg, #818cf8, #a78bfa)",
  },
  {
    id: "blue-cyan",
    name: "Blue / Cyan",
    from: "#3b82f6",
    to: "#06b6d4",
    gradient: "linear-gradient(135deg, #60a5fa, #22d3ee)",
  },
  {
    id: "emerald-teal",
    name: "Emerald / Teal",
    from: "#10b981",
    to: "#14b8a6",
    gradient: "linear-gradient(135deg, #34d399, #2dd4bf)",
  },
  {
    id: "rose-pink",
    name: "Rose / Pink",
    from: "#f43f5e",
    to: "#ec4899",
    gradient: "linear-gradient(135deg, #fb7185, #f472b6)",
  },
  {
    id: "amber-orange",
    name: "Amber / Orange",
    from: "#f59e0b",
    to: "#f97316",
    gradient: "linear-gradient(135deg, #fbbf24, #fb923c)",
  },
  {
    id: "purple-fuchsia",
    name: "Purple / Fuchsia",
    from: "#a855f7",
    to: "#d946ef",
    gradient: "linear-gradient(135deg, #c084fc, #e879f9)",
  },
];
