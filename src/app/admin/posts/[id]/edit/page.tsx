import { getCategories } from "@/actions/category.actions";
import { getPostById } from "@/actions/post.actions";
import React from "react";
import PotsForm from "../../_components/PostForm";
import { notFound } from "next/navigation";

const EditPostPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  try {
    const [post, categories] = await Promise.all([
      getPostById(id),
      getCategories(),
    ]);
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Edit Berita</h2>
          <p className="text-sm line-clamp-1">{post.title}</p>
        </div>
        <PotsForm categories={categories} defaultValues={post} />
      </div>
    );
  } catch {
    notFound();
  }
};

export default EditPostPage;
