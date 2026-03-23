"use client";

import { createPost, updatePost } from "@/actions/post.actions";
import { uploadImageForPost } from "@/actions/media.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[300px] border rounded-md flex items-center justify-center text-sm text-muted-foreground">
      Memuat editor...
    </div>
  ),
});

type Category = { id: string; name: string };

type PostFormProps = {
  categories: Category[];
  defaultValues?: {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    thumbnail: string | null;
    status: string;
    categoryId: string | null;
  };
};

const PostForm = ({ categories, defaultValues }: PostFormProps) => {
  const router = useRouter();
  const isEditing = !!defaultValues?.id;

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [excerpt, setExcerpt] = useState(defaultValues?.excerpt ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [thumbnail, setThumbnail] = useState(defaultValues?.thumbnail ?? "");
  const [status, setStatus] = useState(defaultValues?.status ?? "draft");
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? "");
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingThumbnail, startThumbnailTransition] = useTransition();

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => imageInputRef.current?.click(),
      },
    },
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.set("file", file);

      startUploadTransition(async () => {
        try {
          const res = await uploadImageForPost(formData);

          // ✅ Ambil instance Quill dari DOM — cara paling reliable
          const quillContainer = document.querySelector(".ql-container") as any;
          const quill = quillContainer?.__quill;

          if (quill) {
            const range = quill.getSelection(true) ?? { index: 0 };
            quill.insertEmbed(range.index, "image", res.url);
            quill.setSelection(range.index + 1);
          } else {
            // Fallback — append ke akhir konten
            setContent((prev) => prev + `<img src="${res.url}" />`);
          }

          toast.success("Gambar berhasil diupload");
        } catch (err: any) {
          toast.error(err.message ?? "Gagal mengupload gambar");
        }

        if (imageInputRef.current) imageInputRef.current.value = "";
      });
    },
    [],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content || content === "<p><br></p>") {
      toast.error("Konten berita wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("thumbnail", thumbnail);
    formData.set("status", status);
    formData.set("categoryId", categoryId);

    startTransition(async () => {
      try {
        if (isEditing) {
          await updatePost(defaultValues.id, formData);
          toast.success("Berita berhasil diperbarui");
        } else {
          await createPost(formData);
          toast.success("Berita berhasil dibuat");
        }
        router.push("/admin/posts");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message ?? "Terjadi kesalahan");
      }
    });
  }

  function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startThumbnailTransition(async () => {
      try {
        const res = await uploadImageForPost(formData);
        setThumbnail(res.url);
        toast.success("Thumbnail berhasil diupload");
      } catch (err: any) {
        toast.error(err.message ?? "Gagal mengupload thumbnail");
      }
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6" // ✅ Fix: lg:grid-cols-3 bukan lg-grid-cols-3
    >
      {/* Kolom kiri — konten utama */}
      <div className="lg:col-span-2 space-y-5">
        {" "}
        {/* ✅ Fix: lg:col-span-2 */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Judul *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul berita..."
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Ringkasan</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat berita..."
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Konten *</Label>

          {/* Input file hidden untuk upload gambar via toolbar Quill */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageUpload}
          />

          {isUploading && (
            <p className="text-xs text-primary animate-pulse">
              Mengupload gambar...
            </p>
          )}

          {/* Hapus double wrapper border */}
          <div className="rounded-md border overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="Tulis konten berita di sini..."
              className="min-h-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Kolom kanan — pengaturan */}
      <div className="space-y-5">
        {/* Thumbnail */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <Label>Thumbnail</Label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleThumbnailUpload}
            />

            {thumbnail ? (
              <div className="relative group">
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  width={400}
                  height={225}
                  className="w-full aspect-video object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setThumbnail("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="aspect-video rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            {isUploadingThumbnail ? (
              <p className="text-xs text-primary animate-pulse text-center">
                Mengupload thumbnail...
              </p>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnail ? "Ganti thumbnail" : "Upload thumbnail"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pengaturan */}
        <Card>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-category">Tanpa Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem value={cat.id} key={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tombol aksi */}
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending
              ? "Menyimpan..."
              : isEditing
                ? "Perbarui Berita"
                : "Simpan Berita"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
