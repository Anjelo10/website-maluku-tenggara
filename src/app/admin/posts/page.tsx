import { getPosts } from "@/actions/post.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import PostActions from "./_components/PostActions";

const PostPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { posts, total, totalPages } = await getPosts({
    page,
    status: params.status,
    search: params.search,
  });

  return (
    <div>
      <div className="felex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Berita</h1>
          <p className="text-sm mb-3 ">{total} total berita</p>
        </div>
        <Link href="/admin/posts/create">
          <Button className="gap-2 text-white hover:translate-y-0.5 border hover:bg-white hover:border-black cursor-pointer hover:text-primary transition-all">
            <Plus className="w-4 h-4  " />
            Tambah Berita
          </Button>
        </Link>
      </div>
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tagngal</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 ">
                  Belum ada berita
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs ">{post.slug}</p>
                  </TableCell>
                  <TableCell>
                    {post.category ? (
                      <Badge variant="outline">{post.category.name}</Badge>
                    ) : (
                      <span className="text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                    >
                      {post.status === "published" ? "Publikasi" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(post.createdAt), "d MMM yyyy", {
                      locale: localeId,
                    })}
                  </TableCell>
                  <TableCell>
                    <PostActions postId={post.id} status={post.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/admin/posts?page=${p}`}>
              <Button variant={p === page ? "default" : "outline"}>{p}</Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
