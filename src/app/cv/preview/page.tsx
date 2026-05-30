"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CVPreview } from "@/components/CVPreview";
import type { PortfolioData } from "@/lib/types";

function PreviewInner() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format") ?? "usa";
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cv-builder-data");
      if (!stored) { setError("no-data"); return; }
      setData(JSON.parse(stored) as PortfolioData);
    } catch {
      setError("no-data");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center text-center p-8">
        <div>
          <p className="text-slate-400 mb-4">{error}</p>
          <a href="/cv" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to CV Builder</a>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <CVPreview data={data} format={format} />;
}

export default function CVPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PreviewInner />
    </Suspense>
  );
}
