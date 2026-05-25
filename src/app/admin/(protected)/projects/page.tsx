import { readData } from "@/lib/cms";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";

export default function ProjectsPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Projects</h1>
        <p className="text-slate-400 text-sm mt-1">Add, edit, or remove projects from your portfolio.</p>
      </div>
      <ProjectsEditor initialData={data.projects} />
    </div>
  );
}
