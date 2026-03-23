import { getGalleryImages } from "@/actions/media.actions";
import GalleryGrid from "../galerry/GalleryGrid";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const GaleryView = async () => {
  const { items } = await getGalleryImages({ limit: 4 });
  return (
    <section
      className="py-16 h-screen bg-primary flex justify-center items-center"
      id="berita"
    >
      <div className="container-x text-center ">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Galeri</h2>
            <div className="bg-secondary w-full h-0.5 my-3" />
            <p className="text-sm text-white mt-1">Dokumentasi kegiatan kami</p>
          </div>
        </div>

        <GalleryGrid items={items} />
        <Link href="/galeri">
          <Button
            variant="default"
            className="gap-2 my-5 translate-y-1 bg-white text-primary hover:bg-secondary hover:text-white hover:border-black cursor-pointer transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default GaleryView;
