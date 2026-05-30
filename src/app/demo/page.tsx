import { readData } from "@/lib/cms";
import { HeroDemo } from "@/components/sections/HeroDemo";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  const data = readData();

  return (
    <div className="min-h-screen bg-[#08090c] text-white">

      {/* Minimal demo header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3
                      bg-[#08090c]/80 backdrop-blur border-b border-white/5">
        <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">
          Hero Demo — preview only
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">Update bio in admin for best headline effect</span>
          <a href="/"
            className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors">
            ← Back to site
          </a>
        </div>
      </div>

      {/* New hero */}
      <HeroDemo data={data.personalInfo} />

    </div>
  );
}
