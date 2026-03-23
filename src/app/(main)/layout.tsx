import FloatingNavDemo from "@/components/floating-navbar-demo";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/fragment/Navbar";
import { IconHome } from "@tabler/icons-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const NavItems = [
    {
      name: "Beranda",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Informasi",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Layanan",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Profile",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <>
      <main className="w-full ">
        <FloatingNav navItems={NavItems} />
        {children}
      </main>
    </>
  );
}
