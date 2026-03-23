"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function uploadToCloudinary(file: File, folder: string) {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) throw new Error("Ukuran file maksimal 5MB");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF",
    );
  }
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
}

// GALERI IMAGE UPLOAD
export async function uploadGalleryImage(formData: FormData) {
  const session = await requireAdmin();

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!file) throw new Error("Ffile tidak ditemukan");

  const result = await uploadToCloudinary(file, "maluku-tenggara/galeri");

  const media = await prisma.media.create({
    data: {
      title,
      description,
      filename: file.name,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      uploadedById: session.user.id,
    },
  });
  revalidatePath("/admin/media");
  revalidatePath("/galeri");
  return { success: true, data: media };
}

export async function updateGalleryImage(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const media = await prisma.media.update({
    where: { id },
    data: { title, description },
  });

  revalidatePath("/admin/media");
  revalidatePath("/galeri");
  return { success: true, data: media };
}

export async function getGalleryImages({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number } = {}) {
  const [items, total] = await Promise.all([
    prisma.media.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { id: true, name: true } } },
    }),
    prisma.media.count(),
  ]);
  return { items, total, totalPages: Math.ceil(total / limit), page };
}

export async function deleteGaleryImage(id: string) {
  await requireAdmin();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Gambar tidak ditemukan");

  await cloudinary.uploader.destroy(media.publicId);
  await prisma.media.delete({ where: { id } });

  revalidatePath("/admin/media");
  revalidatePath("/galeri");
  return { success: true };
}

// NEWS IMAGE UPLOAD
export async function uploadImageForPost(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  // Upload ke folder terpisah, tidak disimpan ke tabel media
  const result = await uploadToCloudinary(file, "portal-berita/berita");

  // Hanya kembalikan URL, tidak ada prisma.create
  return { success: true, url: result.secure_url };
}
