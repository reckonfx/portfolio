import { readData } from "@/lib/cms";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";

export default function ExperiencePage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Experience</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your work history and education timeline.</p>
      </div>
      <ExperienceEditor initialData={data.experiences} />
    </div>
  );
}
