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
