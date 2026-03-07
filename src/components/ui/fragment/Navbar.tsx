"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AnimatedContent from "../../AnimatedContent";
import { Button } from "../button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    console.log(handleScroll);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const NavItems = [
    {
      name: "Beranda",
      path: "#home",
    },
    {
      name: "Informasi",
      path: "#about",
    },
    {
      name: "Layanan",
      path: "#project",
    },
    {
      name: "Profil",
      path: "#service",
    },
  ];

  const router = useRouter();
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
    <nav>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
          isScrolled
            ? "bg-white/10 backdrop-blur-lg shadow-elegant border border-white/10 "
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex justify-between text-white items-center">
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={true}
            duration={1.5}
            ease="power3.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1}
            threshold={0.1}
            delay={0.2}
            container={"#home"}
            onComplete={() => {
              console.log("onComplete");
            }}
            onDisappearanceComplete={() => {
              console.log("onDisappearanceComplete");
            }}
          >
            <h1 className="text-white text-xl font-bold leading-none">
              Maluku <br />
              Tenggara
            </h1>
          </AnimatedContent>

          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={true}
            duration={1.5}
            ease="power3.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1}
            threshold={0.1}
            delay={0.2}
            className="flex space-x-6"
            container={"#home"}
            onComplete={() => {
              console.log("onComplete");
            }}
            onDisappearanceComplete={() => {
              console.log("onDisappearanceComplete");
            }}
          >
            <div className="flex items-center space-x-10">
              {NavItems.map((item) => (
                <div
                  key={item.name}
                  className="space-x-10 hover:font-bold hover:scale-x105 transition-all text-shadow-lg"
                >
                  <Link href={item.path} key={item.name}>
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
            <div>
              <Button
                onClick={handleSignOut}
                variant="default"
                className="cursor-pointer bg-secondary"
              >
                Sign Out
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
