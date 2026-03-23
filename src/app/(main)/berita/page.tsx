import { getPublishedPosts } from "@/actions/post.actions";
import { getCategories } from "@/actions/category.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Berita",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kategori?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPublishedPosts({
      page,
      limit: 9,
      categorySlug: params.kategori,
    }),
    getCategories(),
  ]);

  return (
    <main className="container-x">
      {/* Header */}

      <div className="bg-muted/40 border-b mt-30">
        <Link
          href="/#berita"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-color "
        >
          <ArrowLeft className="w-4 h-4 " />
          Kembali ke Beranda
        </Link>
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-3xl font-semibold">Berita</h1>
          <p className="text-secondary mt-1">{total} berita tersedia</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filter kategori */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 cursor-pointer">
            <Link href="/berita">
              <Button
                variant={!params.kategori ? "default" : "outline"}
                size="sm"
                className="cursor-pointer text"
              >
                Semua
              </Button>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/berita?kategori=${cat.slug}`}>
                <Button
                  variant={params.kategori === cat.slug ? "default" : "outline"}
                  size="sm"
                  className="cursor-pointer"
                >
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {/* Grid berita */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>Belum ada berita{params.kategori ? " di kategori ini" : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/berita?page=${page - 1}${params.kategori ? `&kategori=${params.kategori}` : ""}`}
              >
                <Button variant="outline">Sebelumnya</Button>
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/berita?page=${page + 1}${params.kategori ? `&kategori=${params.kategori}` : ""}`}
              >
                <Button variant="outline">Selanjutnya</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
