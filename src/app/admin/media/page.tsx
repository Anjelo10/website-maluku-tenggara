import { getGalleryImages } from "@/actions/media.actions";
import React from "react";
import MediaGallery from "../posts/_components/MediaGallery";

const MediaPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const data = await getGalleryImages({ page });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="text-sm ">{data.total} file</p>
      </div>
      <MediaGallery initialData={data} />
    </div>
  );
};

export default MediaPage;
