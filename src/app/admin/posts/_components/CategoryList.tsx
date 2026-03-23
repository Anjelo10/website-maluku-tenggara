"use client";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/actions/category.actions";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { post: number };
};

const CategoryList = ({
  initialCategories,
}: {
  initialCategories: Category[];
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  const [showFrom, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function openCreate() {
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setShowForm(true);
  }

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (editTarget) {
          const res = await updateCategory(editTarget.id, formData);
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editTarget.id
                ? { ...res.data, _count: editTarget._count }
                : c,
            ),
          );
          toast.success("Kategori berhasil diperbaharui");
        } else {
          const res = await createCategory(formData);
          setCategories((prev) => [
            { ...res.data, _count: { post: 0 } },
            ...prev,
          ]);
          toast.success("Kategori berhasil dibuat");
        }
        setShowForm(false);
      } catch (err: any) {
        toast.error(err.message ?? "Terjadi kesalahan");
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        toast.success("Kategori berhasil");
      } catch (err: any) {
        toast.error(err.message ?? "Terjadi kesalahan");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={openCreate}
          className="gap-2 text-white cursor-pointer hover:bg-white hover:text-primary hover:border-black hover:translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-" />
          Tambah Kategori
        </Button>
      </div>
      <div>
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center ">
              Belum ada kategory
            </CardContent>
          </Card>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs ">{cat.slug}</p>
                  {cat.description && (
                    <p className="text-sm mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{cat._count.post}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(cat)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(cat)}
                    className="text-red-600 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={showFrom} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handelSubmit} className="space-y=4">
            <div>
              <Label>Nama *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editTarget?.name ?? ""}
                placeholder="Name kategori..."
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editTarget?.description ?? ""}
                placeholder="Deskripsi singkat..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus kategori "{deleteTarget?.name}"
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?._count.post
                ? `Kategori in masih memiliki ${deleteTarget._count.post} berita ini tidak bisa dihapus`
                : "Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {deleteTarget?._count.post === 0 && (
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 text-red-200 hover:bg-red-600/80"
              >
                Hapus
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryList;
