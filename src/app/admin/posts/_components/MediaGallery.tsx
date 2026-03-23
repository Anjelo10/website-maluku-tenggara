"use client";
import {
  deleteGaleryImage,
  updateGalleryImage,
  uploadGalleryImage,
} from "@/actions/media.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBytes } from "@/lib/utils";
import { Check, Copy, Trash2, Trash, Upload, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type MediaItem = {
  id: string;
  title: string | null;
  description: string | null;
  filename: string;
  url: string;
  size: number | null;
};

type MediaData = {
  items: MediaItem[];
  total: number;
  totalPages: number;
  page: number;
};

const MediaGallery = ({ initialData }: { initialData: MediaData }) => {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [editTarget, setEditTarget] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setShowUpload(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleUploadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uploadFile) return;

    const form = new FormData(e.currentTarget);
    form.set("file", uploadFile);

    startTransition(async () => {
      try {
        const res = await uploadGalleryImage(form);
        setData((prev) => ({
          ...prev,
          items: [res.data, ...prev.items],
          total: prev.total + 1,
        }));
        toast.success("Foto berhasil diupload");
        setShowUpload(false);
        setUploadFile(null);
        setUploadPreview(null);
      } catch (err: any) {
        toast.error(err.message ?? "Gagal mengupload foto");
      }
    });
  }

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTarget) return;
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await updateGalleryImage(editTarget.id, formData);
        setData((prev) => ({
          ...prev,
          items: prev.items.map((m) =>
            m.id === editTarget.id ? { ...m, ...res.data } : m,
          ),
        }));
        toast.success("Foto berhasil diperbarui");
        setEditTarget(null);
      } catch (err: any) {
        toast.error(err.message ?? "Gagal memperbarui foto");
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteGaleryImage(deleteTarget.id);
        setData((prev) => ({
          ...prev,
          items: prev.items.filter((m) => m.id !== deleteTarget.id),
          total: prev.total - 1,
        }));
        toast.success("Foto berhasil dihapus");
      } catch (err: any) {
        toast.error(err.message ?? "Gagal menghapus foto");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  return (
    <>
      {/* Tombol upload */}
      <div className="flex justify-end mb-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="gap-2 translate-y-1.5 hover:border-black hover:bg-white hover:text-primary transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Foto
        </Button>
      </div>

      {/* Grid galeri */}
      {data.items.length === 0 ? (
        <div
          className="border-2 border-dashed rounded-lg py-20 text-center text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Belum ada foto. Klik untuk upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden border bg-muted aspect-square"
            >
              <Image
                src={item.url}
                alt={item.title ?? item.filename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors">
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform space-y-1.5">
                  {item.title && (
                    <p className="text-white text-xs font-medium truncate">
                      {item.title}
                    </p>
                  )}
                  {item.size && (
                    <p className="text-white/60 text-xs">
                      {formatBytes(item.size)}
                    </p>
                  )}
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 h-7 text-xs gap-1 cursor-pointer text-white hover:bg-white hover:text-yellow-600 transition-colors"
                      onClick={() => setEditTarget(item)}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 w-7 p-0 bg-white text-red-600 cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Upload */}
      <Dialog
        open={showUpload}
        onOpenChange={(o) => {
          if (!o) {
            setUploadFile(null);
            setUploadPreview(null);
          }
          setShowUpload(o);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Foto Galeri</DialogTitle>
          </DialogHeader>
          {uploadPreview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={uploadPreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Judul Foto</Label>
              <Input id="title" name="title" placeholder="Judul foto..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Deskripsi foto yang akan muncul di popup..."
                rows={3}
                className="resize-y break-all w-full"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpload(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Mengupload..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Info Foto</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={editTarget.url}
                  alt={editTarget.title ?? editTarget.filename}
                  fill
                  className="object-cover"
                />
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Judul Foto</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editTarget.title ?? ""}
                    placeholder="Judul foto..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-description">Deskripsi</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editTarget.description ?? ""}
                    placeholder="Deskripsi foto..."
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditTarget(null)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto akan dihapus permanen dari Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MediaGallery;
