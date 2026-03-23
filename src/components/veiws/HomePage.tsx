import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const HomeView = () => {
  return (
    <section className="min-h-screen flex  items-center justify-center w-full relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 w-full h-full object-cover left-0"
        preload="auto"
        src="/videos/background.mp4"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />
      <img
        src="/image/homepage-under.png"
        alt="under"
        className="absolute bottom-[-10] left-0"
      />
    </section>
  );
};
export default HomeView;
