import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type NewsCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    thumbnail: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    category: { name: string; slug: string } | null;
  };
  variant?: "default" | "featured" | "horizontal";
};

const NewsCard = ({ post, variant = "default" }: NewsCardProps) => {
  const date = post.publishedAt ?? post.createdAt;

  if (variant === "featured") {
    return (
      <Link href={`/berita/${post.slug}`} className="group block">
        <div className="relative w-full max-h-[520px] aspect-video rounded-xl overflow-hidden bg-gray-300 ">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm bg-gray-300">
              Tidak ada gambar
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black-20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {post.category && (
                <Badge className="mb-3">{post.category.name}</Badge>
              )}
              <h1 className="text-white text-2xl font-semibold leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-whiet/75 text-sm sm-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <p>
                {format(new Date(date), "d MMM yyyy", { locale: localeId })}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  if (variant === "horizontal") {
    return (
      <Link href={`/berita/${post.slug}`} className="group flex gap-4">
        <div className="relative w-28 h020 shrink rounded-lg overflow-hidden bg-gray-300">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {post.category && (
            <span className="text-sx text-primary font-medium">
              {post.category.name}
            </span>
          )}
          <h1 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
            {post.title}
          </h1>
          <p className="text-xs mt-1.5">
            {format(new Date(date), "d MMM yyyy", { locale: localeId })}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/berita/${post.slug}`} className="group block">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden ">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={600}
            height={338}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-300 text-xs">
            Tidak ada gambar
          </div>
        )}
      </div>
      <div className="mt-3">
        {post.category && (
          <span className="text-xs text-primary font-medium">
            {post.category.name}
          </span>
        )}
        <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-primary mt-0.5">
          {post.title}
        </h3>
        <p>{format(new Date(date), "d MMM yyyy", { locale: localeId })}</p>
      </div>
    </Link>
  );
};

export default NewsCard;
