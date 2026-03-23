"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AnimatedContent from "../../AnimatedContent";

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
  return (
    <nav className="">
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
          isScrolled
            ? "bg-white/10 backdrop-blur-lg shadow-elegant border-b border-white"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex justify-between text-white">
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
            <h1 className="text-white font-bold text-2xl drop-shadow-lg">
              Maluku Tenggara
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
                  className="space-x-10 hover:font-bold hover:scale-x105 transition-all font-semibold"
                >
                  <Link href={item.path} key={item.name}>
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
            <div></div>
          </AnimatedContent>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
