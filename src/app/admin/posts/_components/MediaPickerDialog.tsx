"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/actions/media.actions"; // ← ganti import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaItem = { id: string; url: string; filename: string };

export default function MediaPickerDialog({
  onSelect,
  trigger,
}: {
  onSelect: (url: string) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    // ✅ Ganti getMedia → getGalleryImages
    getGalleryImages({ limit: 50 })
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, [open]);

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    setOpen(false);
    setSelected(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pilih Thumbnail</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border-b pb-3">
          <p className="text-sm text-muted-foreground">
            {items.length} gambar tersedia dari galeri
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            Memuat...
          </div>
        ) : items.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-sm">
            <p className="font-medium">Belum ada gambar di galeri</p>
            <p className="text-xs mt-1 opacity-60">
              Upload foto terlebih dahulu di halaman Galeri
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto py-1 pr-1">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.url)}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                  selected === item.url
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/40",
                )}
              >
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                {selected === item.url && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!selected}>
            Pilih Gambar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
