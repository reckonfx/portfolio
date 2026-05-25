"use client";

import { Download } from "lucide-react";
import { useResumeModal } from "@/components/ResumeModalProvider";

export function ResumeModal() {
  const { openModal } = useResumeModal();
  return (
    <button
      onClick={openModal}
      className="px-6 py-3 rounded-xl border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/10 transition-all flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Resume
    </button>
  );
}
