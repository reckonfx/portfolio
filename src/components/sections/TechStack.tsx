"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Server, Database, Cloud, Cpu, Smartphone, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = { Monitor, Server, Database, Cloud, Cpu, Smartphone };

export function TechStack({ data }: { data: TechCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(data[0]?.category ?? "");
  const active = data.find((t) => t.category === activeCategory) ?? data[0];

  return (
    <section id="stack" className="section-padding relative">
      <div className="absolute inset-0" style={{ background: "var(--theme-bg)" }} />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Tech Stack" title="Tools I Build " highlight="With"
          description="A curated collection of technologies I've mastered to build world-class applications." />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {data.map((cat) => {
            const Icon = iconMap[cat.icon] || Monitor;
            const isActive = cat.category === activeCategory;
            return (
              <motion.button key={cat.category} onClick={() => setActiveCategory(cat.category)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive ? "text-white border border-white/15 shadow-lg" : "glass text-slate-400 hover:text-white hover:border-white/10")}
                style={isActive ? { background: `${cat.color}18`, borderColor: `${cat.color}40`, boxShadow: `0 0 20px ${cat.color}15` } : {}}>
                <Icon className="w-3.5 h-3.5" style={isActive ? { color: cat.color } : {}} />
                {cat.category}
              </motion.button>
            );
          })}
        </div>

        {active && (
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {active.items.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.03 }}
                className="group glass rounded-xl p-4 text-center cursor-default hover:border-white/15 transition-all">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform"
                  style={{ filter: `drop-shadow(0 0 8px ${active.color}40)` }}>{item.icon}</div>
                <div className="text-white text-sm font-medium mb-3">{item.name}</div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${active.color}80, ${active.color})` }} />
                </div>
                <div className="text-slate-600 text-xs mt-1">{item.level}%</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-center text-slate-500 text-sm mb-6 tracking-wider uppercase">All Technologies</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {data.flatMap((cat) =>
              cat.items.map((item) => (
                <span key={`${cat.category}-${item.name}`}
                  className="px-3 py-1.5 rounded-lg glass text-slate-300 text-sm font-medium hover:text-white hover:border-white/15 transition-all cursor-default">
                  {item.icon} {item.name}
                </span>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
