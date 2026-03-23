import BiografiView from "@/components/veiws/BiografiPage";
import GaleryPage from "@/components/veiws/GalleryPage";
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
      <GaleryPage />
    </section>
  );
}
