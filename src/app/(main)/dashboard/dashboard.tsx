"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const DashboarView = () => {
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
    <section className="flex items-center justify-center h-screen w-full">
      <div>
        <h1>Ini Control Panel</h1>
        <Button
          onClick={handleSignOut}
          className="bg-red-600"
          variant={"outline"}
        >
          Sign Out
        </Button>
      </div>
    </section>
  );
};

export default DashboarView;
