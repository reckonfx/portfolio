import { readData } from "@/lib/cms";
import { TechStackEditor } from "@/components/admin/TechStackEditor";

export default function StackPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Tech Stack</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your skill categories and proficiency levels.</p>
      </div>
      <TechStackEditor initialData={data.techStack} />
    </div>
  );
}
