"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/lib/types";

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
  if (!t) return null;

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e10] via-[#0f1014] to-[#0d0e10]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Testimonials" title="What Clients " highlight="Say"
          description="Trusted by startups and enterprises around the world." />

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction}
              initial={{ opacity: 0, x: direction * 60 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }} transition={{ duration: 0.4, ease: "easeInOut" }}
              className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <Quote className="absolute top-6 right-8 w-16 h-16 text-indigo-500/10 rotate-180" />
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-2xl border border-white/10">
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{t.name}</div>
                      <div className="text-slate-400 text-sm">{t.role} · {t.company}</div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">{t.project}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-indigo-500" : "w-1.5 bg-white/20"}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} className="p-2.5 rounded-xl glass text-slate-400 hover:text-white hover:border-white/15 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={next} className="p-2.5 rounded-xl glass text-slate-400 hover:text-white hover:border-white/15 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {data.map((t, i) => (
            <motion.button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              whileHover={{ y: -2 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`glass rounded-xl p-4 text-left transition-all duration-200 ${i === current ? "border-indigo-500/40" : "hover:border-white/10"}`}>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-400 text-xs line-clamp-2 mb-3">&ldquo;{t.content}&rdquo;</p>
              <div className="text-slate-300 text-xs font-medium">{t.name}</div>
              <div className="text-slate-600 text-xs">{t.company}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
