"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sanitizeContent(html: string): string {
  return html
    .replace(/\u00A0/g, " ")
    .replace(/\u200B/g, "")
    .replace(/\u200C/g, "")
    .replace(/\u200D/g, "")
    .replace(/(\w)-(\w)/g, "$1\u2011$2")
    .trim();
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createPost(formData: FormData) {
  const session = await requireAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string | null;
  const thumbnail = formData.get("thumbnail") as string | null;
  const categoryId = formData.get("categoryId") as string | null;
  const status = (formData.get("status") as string) ?? "draft";

  if (!title || !content) throw new Error("Judul dan konten wajib diisi");

  let slug = generateSlug(title);
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content: sanitizeContent(content),
      excerpt,
      thumbnail,
      categoryId: categoryId || null,
      status,
      publishedAt: status === "published" ? new Date() : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  return { success: true, data: post };
}

export async function getPosts({
  page = 1,
  limit = 10,
  status,
  categoryId,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
} = {}) {
  const where = {
    ...(status && { status }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { excerpt: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / limit), page };
}

export async function getPublishedPosts({
  page = 1,
  limit = 10, // ✅ fix: 1 → 10
  categorySlug,
  search,
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
} = {}) {
  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  return getPosts({
    page,
    limit,
    status: "published",
    categoryId: category?.id,
    search,
  });
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: true,
    },
  });
  if (!post) throw new Error("Berita tidak ditemukan");
  return post;
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: true,
    },
  });
  if (!post || post.status !== "published") {
    throw new Error("Berita tidak ditemukan");
  }
  return post;
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string | null;
  const thumbnail = formData.get("thumbnail") as string | null;
  const categoryId = formData.get("categoryId") as string | null;
  const status = formData.get("status") as string;

  if (!title || !content) throw new Error("Judul dan konten wajib diisi");

  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) throw new Error("Berita tidak ditemukan");

  let slug = current.slug;
  if (title !== current.title) {
    slug = generateSlug(title);
    const conflicting = await prisma.post.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflicting) slug = `${slug}-${Date.now()}`;
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content: sanitizeContent(content),
      excerpt,
      thumbnail,
      categoryId: categoryId || null,
      status,
      publishedAt:
        status === "published" && !current.publishedAt
          ? new Date()
          : current.publishedAt,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/berita/${post.slug}`);
  revalidatePath("/berita");
  return { success: true, data: post };
}

export async function deletePost(id: string) {
  await requireAdmin();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Berita tidak ditemukan");

  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  return { success: true };
}

export async function togglePostStatus(id: string) {
  await requireAdmin();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Berita tidak ditemukan");

  const newStatus = post.status === "published" ? "draft" : "published";

  const updated = await prisma.post.update({
    where: { id },
    data: {
      status: newStatus,
      publishedAt:
        newStatus === "published" && !post.publishedAt
          ? new Date()
          : post.publishedAt,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  return { success: true, data: updated };
}
