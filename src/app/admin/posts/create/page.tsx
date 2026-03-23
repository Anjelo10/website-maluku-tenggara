import { getCategories } from "@/actions/category.actions";
import React from "react";
import PostForm from "../_components/PostForm";

const CreatePostPage = async () => {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tambah Berita</h1>
        <p className="text-s ">Buat berita baru</p>
      </div>
      <PostForm categories={categories} />
    </div>
  );
};

export default CreatePostPage;
