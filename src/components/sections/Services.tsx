"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Zap, Cloud, Palette, BarChart3, ArrowRight, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Service } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = { Code2, Cpu, Zap, Cloud, Palette, BarChart3 };

export function Services({ data }: { data: Service[] }) {
  return (
    <section id="services" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e10] via-[#0a0b0e] to-[#0d0e10]" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Solutions" title="Solutions That Help " highlight="Businesses Scale"
          description="From concept to deployment — end-to-end technical solutions designed around your business goals." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((service, i) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group glass rounded-2xl p-6 border border-white/6 hover:border-white/12 hover:shadow-[0_0_30px_rgba(99,102,241,0.06)] transition-all duration-350 cursor-default">

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${service.color}12`, border: `1px solid ${service.color}22`, boxShadow: `0 0 24px ${service.color}08` }}>
                  <Icon className="w-5 h-5 transition-all duration-300" style={{ color: service.color }} />
                </div>

                <h3 className="text-white font-semibold text-[15px] mb-2.5">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-slate-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-semibold" style={{ color: service.color }}>{service.price}</span>
                  <a href="#contact" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors group/link">
                    Get started
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-violet-600/10 to-indigo-600/5" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to start a project?</h3>
            <p className="text-slate-400 mb-6">Let&apos;s discuss your idea and turn it into reality together.</p>
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
              Start a Conversation <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
