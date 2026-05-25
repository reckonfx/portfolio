"use client";

import { useState, useTransition } from "react";
import { saveExperiences } from "@/lib/actions";
import type { Experience } from "@/lib/types";
import { AdminFormWrapper, Field, Input, Textarea, Select, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { toast } from "sonner";

const typeOptions = [
  { value: "work", label: "Work" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "education", label: "Education" },
];

export function ExperienceEditor({ initialData }: { initialData: Experience[] }) {
  const [experiences, setExperiences] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, exp: Experience) => setExperiences((prev) => { const n = [...prev]; n[i] = exp; return n; });
  const remove = (i: number) => setExperiences((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setExperiences((prev) => [...prev, { title: "", company: "", period: "", description: "", tech: [], type: "work" }]);

  function handleSave() {
    startTransition(async () => {
      await saveExperiences(experiences);
      toast.success("Experience saved!");
    });
  }

  return (
    <div className="space-y-4">
      <AdminFormWrapper title={`Experience (${experiences.length})`}>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
              <div className="flex justify-end"><DeleteButton onClick={() => remove(i)} /></div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Title" className="sm:col-span-2">
                  <Input value={exp.title} onChange={(v) => update(i, { ...exp, title: v })} placeholder="Senior Developer" />
                </Field>
                <Field label="Type">
                  <Select value={exp.type} onChange={(v) => update(i, { ...exp, type: v as Experience["type"] })} options={typeOptions} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Company / Institution">
                  <Input value={exp.company} onChange={(v) => update(i, { ...exp, company: v })} />
                </Field>
                <Field label="Period">
                  <Input value={exp.period} onChange={(v) => update(i, { ...exp, period: v })} placeholder="2022 — Present" />
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={exp.description} onChange={(v) => update(i, { ...exp, description: v })} rows={2} />
              </Field>
              <Field label="Tech (comma-separated)">
                <Input value={exp.tech.join(", ")} onChange={(v) => update(i, { ...exp, tech: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="React, Node.js..." />
              </Field>
            </div>
          ))}
        </div>
        <div className="mt-4"><AddButton onClick={add} label="Add Experience" /></div>
      </AdminFormWrapper>
      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
