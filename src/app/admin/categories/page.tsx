import { getCategories } from "@/actions/category.actions";
import React from "react";
import CategoryList from "../posts/_components/CategoryList";

const CategoriesPage = async () => {
  const categories = await getCategories();
  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold">Kategori</h1>
        <p>Kelola kategori berita</p>
      </div>
      <CategoryList initialCategories={categories} />
    </div>
  );
};

export default CategoriesPage;
