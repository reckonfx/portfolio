"use client";

import { useState, useTransition } from "react";
import { saveTestimonials } from "@/lib/actions";
import type { Testimonial } from "@/lib/types";
import { AdminFormWrapper, Field, Input, Textarea, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { Star } from "lucide-react";
import { toast } from "sonner";

function TestimonialCard({ t, onUpdate, onDelete }: { t: Testimonial; onUpdate: (t: Testimonial) => void; onDelete: () => void }) {
  const set = (key: keyof Testimonial, value: unknown) => onUpdate({ ...t, [key]: value });

  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
      <div className="flex justify-end"><DeleteButton onClick={onDelete} /></div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Name"><Input value={t.name} onChange={(v) => set("name", v)} /></Field>
        <Field label="Role"><Input value={t.role} onChange={(v) => set("role", v)} placeholder="CEO, CTO..." /></Field>
        <Field label="Company"><Input value={t.company} onChange={(v) => set("company", v)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Project"><Input value={t.project} onChange={(v) => set("project", v)} placeholder="Payment Platform" /></Field>
        <Field label="Rating">
          <div className="flex items-center gap-1 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => set("rating", star)}>
                <Star className={`w-5 h-5 transition-colors ${star <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Testimonial">
        <Textarea value={t.content} onChange={(v) => set("content", v)} rows={3} />
      </Field>
    </div>
  );
}

export function TestimonialsEditor({ initialData }: { initialData: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, t: Testimonial) => setTestimonials((prev) => { const n = [...prev]; n[i] = t; return n; });
  const remove = (i: number) => setTestimonials((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setTestimonials((prev) => [...prev, { name: "", role: "", company: "", avatar: "", content: "", rating: 5, project: "" }]);

  function handleSave() {
    startTransition(async () => {
      await saveTestimonials(testimonials);
      toast.success("Testimonials saved!");
    });
  }

  return (
    <div className="space-y-4">
      <AdminFormWrapper title={`Testimonials (${testimonials.length})`}>
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} onUpdate={(updated) => update(i, updated)} onDelete={() => remove(i)} />
          ))}
        </div>
        <div className="mt-4"><AddButton onClick={add} label="Add Testimonial" /></div>
      </AdminFormWrapper>
      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
