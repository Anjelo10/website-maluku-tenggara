"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "./ui/sidebar";
import Link from "next/link";
import * as Icons from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Propstypes = {
  list: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
};

const SidebarApp = ({ list }: Propstypes) => {
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } else {
      toast.success("Berhasil keluar");
      router.push("/sign-in");
    }
  }
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="shadow-2xl   ">
      <SidebarHeader>
        <Link href="/">
          <div className="flex gap-2 items-center pt-3">
            <Image src="/image/logo.png" alt="logo" width={30} height={30} />
            <h1 className="group-data-[state=collapsed]:hidden font-bold text-xl text-primary">
              Maluku Tenggara
            </h1>
          </div>
        </Link>

        <div className="flex justify-center">
          <div className="flex justify-center bg-primary h-0.5 w-30 group-data-[state=collapsed]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex  space-y-2 group-data-[state=collapsed]:items-center">
          {list.map((item) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
            return (
              <div key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`[&>svg]:size-4.5  w-58 transition-all hover:translate-0.5
                    ${
                      pathname === item.url
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-primary/50 "
                    }`}
                >
                  <Link href={item.url}>
                    <IconComponent />
                    <span className="text-sm font-semibold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </div>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="h-18 group-data-[state=collapsed]:hidden">
        <Button
          className="w-full  text-white cursor-pointer hover:translate-y-0.5 hover:shadow-deep-soft hover:text-primary border hover:border-black hover:bg-white"
          onClick={handleSignOut}
        >
          <Icons.LogOut />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarApp;
