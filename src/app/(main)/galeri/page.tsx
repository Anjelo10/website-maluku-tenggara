import { getGalleryImages } from "@/actions/media.actions";
import GalleryGrid from "@/components/galerry/GalleryGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Galeri",
};

const GalleryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 12;

  const { items, total, totalPages } = await getGalleryImages({ page, limit });

  return (
    <main className="w-full container-x">
      <div className=" border-b my-10">
        <div className="mb-10">
          <Link
            href="/#berita"
            className="flex items-center text-primary text-sm hover:text-secondary transition-colors mb-5 "
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Kembali ke beranda
          </Link>
          <h1 className="text-3xl font-semibold">Galeri</h1>
          <p className="text-primary mt-1">{total} foto tersedia</p>
        </div>
      </div>
      <div>
        {items.length === 0 ? (
          <div className="text-center py-10 text-primary">
            <p>Belum ada foto tersedia.</p>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link href={`/galeri?page=${page - 1}`}>
                <Button variant="outline">Sebelumnya</Button>
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-primary">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/galeri?page=${page + 1}`}>
                <Button variant="outline">Selanjutnya</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default GalleryPage;
