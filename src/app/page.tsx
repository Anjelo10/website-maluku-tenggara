import Navbar from "@/components/ui/fragment/Navbar";
import BiografiView from "@/components/veiws/BiografiPage";
import HomeView from "@/components/veiws/HomePage";
import LayananView from "@/components/veiws/LayananPage";

export default function Home() {
  return (
    <section>
      <Navbar />
      <HomeView />
      <BiografiView />
      <LayananView />
    </section>
  );
}
