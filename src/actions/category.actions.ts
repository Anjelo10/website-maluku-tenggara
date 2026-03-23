"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-=/g, "-");
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

//CREATE
export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;

  if (!name) throw new Error("Nama kategori wajib diisi");

  const slug = generateSlug(name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new Error("Kategori dengan nama ini sudah ada");

  const category = await prisma.category.create({
    data: { name, slug, description },
  });

  revalidatePath("/admin/categories");
  return { success: true, data: category };
}

// READ ALL
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { post: true } } },
  });
}

// READ ONE
export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Kategori tidak ditemukan");
  return category;
}

// UPDATE
export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;

  if (!name) throw new Error("Name kategori wajib diisi");

  const slug = generateSlug(name);

  const conflicting = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflicting) throw new Error("Kategori dengan nama ini sudah ada");

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug, description },
  });
  revalidatePath("/admin/categories");
  return { success: true, data: category };
}

// DELETE
export async function deleteCategory(id: string) {
  await requireAdmin();

  const postCount = await prisma.post.count({ where: { categoryId: id } });
  if (postCount > 0) {
    throw new Error(`
        Tidak bisa menghapus kategori yang masih memiliki ${postCount} berita
      `);
  }
  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  return { success: true };
}
