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
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Professional Summary</h3>
              <p className="text-slate-400 leading-relaxed">{personalInfo.bio}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 gap-4 mb-6">
              {personalInfo.stats.map((stat, i) => (
                <div key={i} className="glass rounded-xl p-4 text-center hover:border-indigo-500/30 transition-colors">
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}{stat.suffix}</div>
                  <div className="text-slate-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass hover:border-white/10 transition-colors">
                    <span className="text-xl">{cert.badge}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{cert.name}</div>
                      <div className="text-xs text-slate-500">{cert.issuer} · {cert.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-500 rounded" />
              Experience & Education
            </h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-violet-500/30 to-transparent" />
              <div className="space-y-6">
                {experiences.map((exp, i) => {
                  const Icon = typeIcons[exp.type as keyof typeof typeIcons] || Briefcase;
                  const color = typeColors[exp.type as keyof typeof typeColors] || typeColors.work;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative pl-12">
                      <div className={`absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="glass rounded-xl p-4 hover:border-indigo-500/20 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm leading-tight">{exp.title}</h4>
                          <span className="text-xs text-slate-500 whitespace-nowrap">{exp.period}</span>
                        </div>
                        <div className="text-indigo-400 text-xs font-medium mb-2">{exp.company}</div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-3">{exp.description}</p>
                        {exp.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.tech.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-slate-400 text-xs">{t}</span>
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
