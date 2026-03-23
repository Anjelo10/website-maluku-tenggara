import { getPostBySlug, getPublishedPosts } from "@/actions/post.actions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { id as localeId } from "date-fns/locale";
import Image from "next/image";
import NewsCard from "@/components/news/NewsCard";

const BeritaDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  try {
    const [post, { posts: relate }] = await Promise.all([
      getPostBySlug(slug),
      getPublishedPosts({ limit: 3 }),
    ]);

    const relatedPosts = relate.filter((p) => p.slug !== slug).slice(0, 3);
    const date = post.publishedAt ?? post.createdAt;
    return (
      <main className="w-full">
        <div className="container mx-auto px-6 py-10 max-w-4xl mt-20 ">
          {/* Tombol kembali */}
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-color mb-2"
          >
            <ArrowLeft className="w-4 h-4 " />
            Kembali ke Berita
          </Link>
          <div className="mb-8">
            {post.category && (
              <Link href={`/berita?kategoru=${post.category.slug}`}>
                <Badge className="mb-4">{post.category.name}</Badge>
              </Link>
            )}
            <h1 className="text-3xl font-semibold leading-snug">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-primary text-lg mt-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4 text-sm text-primary">
              <span>{post.author.name}</span>
              <span>.</span>
              <span>
                {format(new Date(date), "d MMM yyyy", { locale: localeId })}
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          )}

          {/* Kontent - render HTML dari quil */}
          <div
            className="ql-editor prose prose-neutral dark:prose-invert max-w-none w-full !break-normal"
            style={{
              wordBreak: "normal",
              overflowWrap: "break-word",
              textAlign: "left", // Pakai left dulu agar kita tahu apakah kata sudah turun dengan benar
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* Berita terkait */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t">
              <h1 className="text-xl font-semibold mb-6">Berita Lainnya</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <NewsCard key={p.id} post={p} variant="default" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  } catch {
    notFound();
  }
};

export default BeritaDetailPage;
