import { type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Portfolio CMS" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-60 min-h-screen pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
