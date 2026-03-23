import SidebarApp from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/sign-in");

  const listSideBar = [
    { title: "Dashboard", url: "/admin", icon: "LayoutDashboard" },
    { title: "Berita", url: "/admin/posts", icon: "Newspaper" },
    {
      title: "Kategori",
      url: "/admin/categories",
      icon: "ChartBarStacked",
    },
    {
      title: "Media Galeri",
      url: "/admin/media",
      icon: "HardDrive",
    },
  ];

  return (
    <div className="flex">
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <SidebarApp list={listSideBar} />
          <SidebarTrigger className="bg-white flex items-center justify-center w-10 h-10" />
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
