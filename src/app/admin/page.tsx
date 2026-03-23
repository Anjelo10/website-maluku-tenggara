import { getCategories } from "@/actions/category.actions";
import { getGalleryImages } from "@/actions/media.actions";
import { getPosts } from "@/actions/post.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/get-session";
import { Eye, FolderOpen, Image, Newspaper } from "lucide-react";
import { forbidden, unauthorized } from "next/navigation";

const AdminPanel = async () => {
  const [
    { total: totalPosts },
    { total: totalPublished },
    categories,
    { total: totalMedia },
  ] = await Promise.all([
    getPosts(),
    getPosts({ status: "published" }),
    getCategories(),
    getGalleryImages(),
  ]);

  const stast = [
    { label: "Total Berita", value: totalPosts, icon: Newspaper },
    { label: "Diplikasikan", value: totalPublished, icon: Eye },
    { label: "Kategori", value: categories.length, icon: FolderOpen },
    { label: "Media", value: totalMedia, icon: Image },
  ];

  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();
  if (user.role !== "admin") forbidden();

  return (
    <section className="">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stast.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className=" flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
                <Icon className="w-10 h-10 mt-2 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AdminPanel;
