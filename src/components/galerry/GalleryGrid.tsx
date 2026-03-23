"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItems = {
  id: string;
  url: string;
  title: string;
  description: string;
  filename: string;
};

const GalleryGrid = ({ items }: { items: GalleryItems[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  function prev() {
    setActiveIndex((i) =>
      i !== null ? (i - 1 + items.length) % items.length : 0,
    );
  }
  function next() {
    setActiveIndex((i) => (i !== null ? (i + 1) % items.length : 0));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setActiveIndex(null);
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 "
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 24vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black.40 transition-colors flex items-end">
              {item.title && (
                <p className="text-primary text-xl font-medium p-3 translate-y-full group-hover:translate-y-0 transition-transform line-clamp-2 text-shadow-lg">
                  {item.title}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox popup */}
      <Dialog
        open={activeIndex !== null}
        onOpenChange={(o) => !o && setActiveIndex(null)}
      >
        <DialogContent
          className="max-w-3xl p-0 overflow-hidden bg-black border-0 outline-none"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle>Galery</DialogTitle>
          {activeItem && (
            <div className="flex flex-col">
              <div className="relative w-full aspect-video bg-black">
                <Image
                  src={activeItem.url}
                  alt={activeItem.title ?? activeItem.filename}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vww, 768px"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-white hover:bg-white/20 z-10"
                  onClick={() => setActiveIndex(null)}
                >
                  <X className="w-5 h-5" />
                </Button>

                {items.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                      onClick={prev}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  {activeIndex! + 1} / {items.length}
                </div>
              </div>
              {(activeItem.title || activeItem.description) && (
                <div className="p-5 bg-zinc-900 text-white">
                  {activeItem.title && (
                    <h3 className="font-medium text-base">
                      {activeItem.title}
                    </h3>
                  )}
                  {activeItem.description && (
                    <p className="text-sm text-white/70 mt-1.5 leading-relaxed">
                      {activeItem.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
