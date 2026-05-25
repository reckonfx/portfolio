"use client";

import { useState, useTransition } from "react";
import { saveTechStack } from "@/lib/actions";
import type { TechCategory, TechItem } from "@/lib/types";
import { AdminFormWrapper, Field, Input, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { toast } from "sonner";

function ItemRow({ item, onUpdate, onDelete }: { item: TechItem; onUpdate: (i: TechItem) => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/5">
      <Input value={item.icon} onChange={(v) => onUpdate({ ...item, icon: v })} placeholder="🔷" className="w-12 text-center" />
      <Input value={item.name} onChange={(v) => onUpdate({ ...item, name: v })} placeholder="Technology name" className="flex-1" />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <input type="range" min={0} max={100} value={item.level}
          onChange={(e) => onUpdate({ ...item, level: Number(e.target.value) })}
          className="w-20 accent-indigo-500" />
        <span className="text-slate-400 text-xs w-8">{item.level}%</span>
      </div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

export function TechStackEditor({ initialData }: { initialData: TechCategory[] }) {
  const [stack, setStack] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const updateCat = (i: number, cat: TechCategory) => setStack((s) => { const n = [...s]; n[i] = cat; return n; });
  const removeCat = (i: number) => setStack((s) => s.filter((_, idx) => idx !== i));
  const addCat = () => setStack((s) => [...s, { category: "New Category", icon: "Monitor", color: "#818cf8", items: [] }]);

  const addItem = (catIdx: number) => {
    const cat = stack[catIdx];
    updateCat(catIdx, { ...cat, items: [...cat.items, { name: "", level: 80, icon: "⚡" }] });
  };
  const updateItem = (catIdx: number, itemIdx: number, item: TechItem) => {
    const cat = stack[catIdx];
    const items = [...cat.items]; items[itemIdx] = item;
    updateCat(catIdx, { ...cat, items });
  };
  const removeItem = (catIdx: number, itemIdx: number) => {
    const cat = stack[catIdx];
    updateCat(catIdx, { ...cat, items: cat.items.filter((_, i) => i !== itemIdx) });
  };

  function handleSave() {
    startTransition(async () => {
      await saveTechStack(stack);
      toast.success("Tech stack saved!");
    });
  }

  return (
    <div className="space-y-4">
      {stack.map((cat, i) => (
        <AdminFormWrapper key={i} title="">
          <div className="flex items-center gap-3 mb-4">
            <Field label="Category Name" className="flex-1">
              <Input value={cat.category} onChange={(v) => updateCat(i, { ...cat, category: v })} />
            </Field>
            <Field label="Icon Key" className="w-28">
              <Input value={cat.icon} onChange={(v) => updateCat(i, { ...cat, icon: v })} placeholder="Monitor" />
            </Field>
            <Field label="Color" className="w-28">
              <div className="flex items-center gap-2">
                <input type="color" value={cat.color} onChange={(e) => updateCat(i, { ...cat, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <Input value={cat.color} onChange={(v) => updateCat(i, { ...cat, color: v })} className="flex-1" />
              </div>
            </Field>
            <div className="pt-5">
              <DeleteButton onClick={() => removeCat(i)} label="Remove" />
            </div>
          </div>

          <div className="space-y-2">
            {cat.items.map((item, j) => (
              <ItemRow key={j} item={item} onUpdate={(updated) => updateItem(i, j, updated)} onDelete={() => removeItem(i, j)} />
            ))}
          </div>
          <div className="mt-3">
            <AddButton onClick={() => addItem(i)} label="Add Skill" />
          </div>
        </AdminFormWrapper>
      ))}

      <div className="flex gap-3 justify-between">
        <AddButton onClick={addCat} label="Add Category" />
        <SaveButton onClick={handleSave} isPending={isPending} />
      </div>
    </div>
  );
}
