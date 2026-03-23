"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { LayoutDashboard, User, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const { data } = useSession();
  const router = useRouter();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.1) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } else {
      toast.success("Berhasil keluar");
      router.refresh();
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit  fixed top-5 inset-x-0 mx-auto z-5000 items-center justify-center",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2 rounded-full border px-10 py-2 shadow-lg shadow-black/10 bg-primary backdrop-blur-lg shadow-elegant border-b border-secondary w-screen mx-20">
          <div>
            <Image
              src="/image/logo-pemerintahan.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-50"
            />
          </div>

          {/* Nav items container */}
          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx: number) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative flex items-center  text-base rounded-full px-10 py-2  font-medium text-white transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white",
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          {/* <div className="h-5 w-px bg-neutral-200 dark:bg-white/10" /> */}

          {/* CTA Button */}
          <div className="relative">
            {data ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="cursor-pointer">
                    <UserRoundPen className="w-4 h-4" />
                    hi! {data?.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  asChild
                  className="w-4 z-5000 border-none absolute left-0"
                  align="start"
                >
                  <DropdownMenuGroup className="bg-white border-none ring-secondary ">
                    <DropdownMenuItem className="hover:bg-gray-300">
                      {data.user.role === "admin" ? (
                        <Link
                          href="/dashboar"
                          className="flex gap-2 text-primary items-center font-semibold"
                        >
                          <LayoutDashboard />
                          Dashboard
                        </Link>
                      ) : (
                        <div />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-400" />
                    <DropdownMenuItem>
                      <Button
                        className="bg-primary w-full text-white"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // <div className="bg-secondary p-1.5 rounded-full flex items-center justify-center">
              //   <User className="w-6 h-6 text-primary rounded-sm text-center" />
              // </div>
              <Link href="sign-in">
                <Button variant="secondary" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
