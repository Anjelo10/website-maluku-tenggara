import { getPublishedPosts } from "@/actions/post.actions";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import NewsCard from "../news/NewsCard";

const NewsPage = async () => {
  const { posts } = await getPublishedPosts({ limit: 7 });

  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;

  return (
    <section className="container-x scroll-mt-20" id="berita">
      <div className="container mx-auto  my-30">
        <div className="flex  items-center justify-between w-full mb-8 ">
          <div>
            <h1 className="text-2xl font-semibold">Berita Terkini</h1>
            <p className="text-sm mt-1 text-gray-300">
              Informasi terbaru dari kami
            </p>
          </div>
          <Link href="/berita">
            <Button
              variant="outline"
              className="gap-2 bg-primary text-white cursor-pointer hover:bg-white hover:text-primary hover:border transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsCard post={featured} variant="featured" />
          </div>
          <div className="flex flex-col justify-start gap-5">
            {rest.slice(0, 5).map((post) => (
              <NewsCard key={post.id} post={post} variant="horizontal" />
            ))}
          </div>
        </div>
        {/* {rest.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 overflow-hidden">
            {rest.slice(4).map((post) => (
              <NewsCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
};

export default NewsPage;
