"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Rocket, Award } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PersonalInfo, Experience, Certification } from "@/lib/types";

const typeIcons = {
  work: Briefcase,
  entrepreneurship: Rocket,
  education: GraduationCap,
};

const typeColors = {
  work: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  entrepreneurship: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  education: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

interface AboutData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  certifications: Certification[];
}

export function About({ data }: { data: AboutData }) {
  const { personalInfo, experiences, certifications } = data;

  return (
    <section id="about" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e10] via-[#0f1014] to-[#0d0e10]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="About Me" title="The Story " highlight="Behind the Code"
          description="Passionate about crafting digital experiences that make a real impact. Here's my journey." />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ── Left column ── */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 border border-white/6">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Professional Summary</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{personalInfo.bio}</p>
            </motion.div>

            {/* Stats grid */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 gap-3">
              {personalInfo.stats.map((stat, i) => (
                <div key={i} className="group glass rounded-xl p-4 text-center border border-white/6 hover:border-indigo-500/25 hover:bg-indigo-500/5 transition-all duration-300 cursor-default">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1.5 group-hover:scale-105 transition-transform duration-200">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-slate-500 text-xs leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Certifications */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl glass border border-white/5 hover:border-white/10 transition-all duration-200 group">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg flex-shrink-0">
                      {cert.badge || "🏆"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{cert.name}</div>
                      <div className="text-xs text-slate-500">{cert.issuer} · {cert.year}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column: Timeline ── */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-5 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded" />
              Experience & Education
            </h3>
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-violet-500/30 to-transparent" />
              <div className="space-y-5">
                {experiences.map((exp, i) => {
                  const Icon = typeIcons[exp.type as keyof typeof typeIcons] || Briefcase;
                  const color = typeColors[exp.type as keyof typeof typeColors] || typeColors.work;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative pl-12">
                      <div className={`absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center border ${color} shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/[0.02] transition-all duration-200">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm leading-tight">{exp.title}</h4>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">{exp.period}</span>
                        </div>
                        <div className="text-indigo-400 text-xs font-medium mb-2">{exp.company}</div>
                        {exp.description && (
                          <p className="text-slate-400 text-xs leading-relaxed mb-3">{exp.description}</p>
                        )}
                        {exp.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.tech.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-md bg-indigo-500/8 border border-indigo-500/15 text-indigo-300/80 text-[10px]">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
