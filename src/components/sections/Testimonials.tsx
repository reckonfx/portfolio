"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Zap, ShieldCheck, MessageSquare, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/lib/types";

const WHY_ME = [
  {
    icon: TrendingUp,
    title: "Business-First Thinking",
    desc: "Every line of code is written with your business goal in mind — not just technical elegance.",
    color: "#6366f1",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    desc: "Regular updates, clear timelines, and no surprises — you're always in the loop.",
    color: "#8b5cf6",
  },
  {
    icon: ShieldCheck,
    title: "Production-Ready Code",
    desc: "Scalable, documented, and maintainable systems built to grow with your business.",
    color: "#06b6d4",
  },
  {
    icon: Zap,
    title: "Fast, Agile Delivery",
    desc: "Rapid iteration cycles so you see results quickly and can pivot when needed.",
    color: "#10b981",
  },
];

export function Testimonials({ data }: { data: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % data.length);
  }, [data.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + data.length) % data.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = data[current];

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="absolute inset-0" style={{ background: "var(--theme-bg)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Why Work With Me ── */}
        <div className="mb-24">
          <SectionHeader badge="Why Me" title="Simple. Transparent. " highlight="Effective."
            description="The values and practices that make every project a success." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ME.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass rounded-2xl p-5 border border-white/6 hover:border-white/12 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}14`, border: `1px solid ${item.color}22` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Testimonials ── */}
        <SectionHeader badge="Testimonials" title="Trusted By " highlight="Businesses"
          description="What clients say about working together." />

        {t && (
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/6"
              >
                <Quote className="absolute top-6 right-8 w-16 h-16 text-indigo-500/10 rotate-180" />
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-2xl border border-white/10 font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-slate-200 text-lg leading-relaxed mb-6 italic">
                      &ldquo;{t.content}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="text-white font-semibold">{t.name}</div>
                        <div className="text-slate-400 text-sm">{t.role} · {t.company}</div>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                        {t.project}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {data.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-indigo-500" : "w-1.5 bg-white/20"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="p-2.5 rounded-xl glass border border-white/6 text-slate-400 hover:text-white hover:border-white/15 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="p-2.5 rounded-xl glass border border-white/6 text-slate-400 hover:text-white hover:border-white/15 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mini testimonial cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {data.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`glass rounded-xl p-4 text-left transition-all duration-200 border ${i === current ? "border-indigo-500/40 bg-indigo-500/5" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-400 text-xs line-clamp-2 mb-3">&ldquo;{item.content}&rdquo;</p>
              <div className="text-slate-300 text-xs font-medium">{item.name}</div>
              <div className="text-slate-600 text-xs">{item.company}</div>
            </motion.button>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 relative rounded-2xl overflow-hidden border border-white/6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/8 via-violet-600/12 to-indigo-600/8" />
          <div className="absolute inset-0 bg-white/[0.015]" />
          <div className="relative text-center py-12 px-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Build Something Great?</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Let&apos;s turn your idea into a product that delivers real results.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Start a Project
              </a>
              <a href="#projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-200">
                See My Work
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
