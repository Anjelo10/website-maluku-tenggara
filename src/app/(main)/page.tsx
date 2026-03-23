import BiografiView from "@/components/veiws/BiografiPage";
import HomeView from "@/components/veiws/HomePage";
import LayananView from "@/components/veiws/LayananPage";
import NewsPage from "@/components/veiws/NewsPage";

export default function Home() {
  return (
    <section>
      <HomeView />
      <BiografiView />
      <LayananView />
      <NewsPage />
    </section>
  );
}
