"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Server, Database, Cloud, Cpu, Smartphone, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Monitor, Server, Database, Cloud, Cpu, Smartphone,
};

// Simple Icons CDN — colored for dark backgrounds
const TECH_LOGOS: Record<string, string> = {
  "React":               "https://cdn.simpleicons.org/react/61DAFB",
  "Next.js":             "https://cdn.simpleicons.org/nextdotjs/ffffff",
  "TypeScript":          "https://cdn.simpleicons.org/typescript/3178C6",
  "Tailwind CSS":        "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "Framer Motion":       "https://cdn.simpleicons.org/framer/ffffff",
  "Node.js":             "https://cdn.simpleicons.org/nodedotjs/339933",
  "Python":              "https://cdn.simpleicons.org/python/3776AB",
  "FastAPI":             "https://cdn.simpleicons.org/fastapi/009688",
  "Express.js":          "https://cdn.simpleicons.org/express/ffffff",
  "PostgreSQL":          "https://cdn.simpleicons.org/postgresql/336791",
  "MongoDB":             "https://cdn.simpleicons.org/mongodb/47A248",
  "Supabase":            "https://cdn.simpleicons.org/supabase/3ECF8E",
  "MySQL":               "https://cdn.simpleicons.org/mysql/4479A1",
  "Vercel":              "https://cdn.simpleicons.org/vercel/ffffff",
  "Docker":              "https://cdn.simpleicons.org/docker/2496ED",
  "GitHub Actions":      "https://cdn.simpleicons.org/githubactions/2088FF",
  "AWS":                 "https://cdn.simpleicons.org/amazonwebservices/FF9900",
  "HuggingFace Spaces":  "https://cdn.simpleicons.org/huggingface/FFD21E",
  "OpenAI API":          "https://cdn.simpleicons.org/openai/ffffff",
  "Qdrant":              "https://cdn.simpleicons.org/qdrant/FF3366",
  "React Native":        "https://cdn.simpleicons.org/react/61DAFB",
  "Expo":                "https://cdn.simpleicons.org/expo/ffffff",
};

function TechLogo({ name, color }: { name: string; color: string }) {
  const [err, setErr] = useState(false);
  const url = TECH_LOGOS[name];

  if (url && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 object-contain mx-auto"
        loading="lazy"
        onError={() => setErr(true)}
      />
    );
  }

  const initials = name
    .split(/[\s./]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold mx-auto"
      style={{ background: `${color}25`, color }}
    >
      {initials}
    </div>
  );
}

export function TechStack({ data }: { data: TechCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(data[0]?.category ?? "");
  const active = data.find((t) => t.category === activeCategory) ?? data[0];

  return (
    <section id="stack" className="section-padding relative">
      <div className="absolute inset-0" style={{ background: "var(--theme-bg)" }} />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Tech Stack"
          title="Tools I "
          highlight="Build With"
          description="A curated collection of technologies I've mastered to build world-class applications."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {data.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] ?? Monitor;
            const isActive = cat.category === activeCategory;
            return (
              <motion.button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-white border border-white/15 shadow-lg"
                    : "glass text-slate-400 hover:text-white hover:border-white/10"
                )}
                style={
                  isActive
                    ? {
                        background: `${cat.color}18`,
                        borderColor: `${cat.color}40`,
                        boxShadow: `0 0 20px ${cat.color}15`,
                      }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" style={isActive ? { color: cat.color } : {}} />
                {cat.category}
              </motion.button>
            );
          })}
        </div>

        {/* Tech cards — centered regardless of count */}
        {active && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            {active.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={{ y: -5, scale: 1.04 }}
                className="group glass rounded-2xl p-5 text-center cursor-default hover:border-white/15 transition-all duration-200 w-[calc(50%-8px)] sm:w-40"
              >
                {/* Logo */}
                <div
                  className="mb-3 group-hover:scale-110 transition-transform duration-200"
                  style={{ filter: `drop-shadow(0 0 10px ${active.color}40)` }}
                >
                  <TechLogo name={item.name} color={active.color} />
                </div>

                {/* Name */}
                <div className="text-white text-xs font-semibold mb-3 leading-snug">{item.name}</div>

                {/* Proficiency bar */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${active.color}80, ${active.color})`,
                    }}
                  />
                </div>
                <div className="text-slate-600 text-[10px] mt-1">{item.level}%</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* All technologies — small logo + name tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-center text-slate-600 text-[11px] mb-4 tracking-widest uppercase">
            All Technologies
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {data.flatMap((cat) =>
              cat.items.map((item) => (
                <span
                  key={`${cat.category}-${item.name}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-slate-400 text-xs font-medium hover:text-white hover:border-white/15 transition-all cursor-default"
                >
                  {TECH_LOGOS[item.name] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={TECH_LOGOS[item.name]}
                      alt=""
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  {item.name}
                </span>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
