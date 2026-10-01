import PhotoFeed from "@/components/pages/photoFeed/PhotoFeed";

const page = async ({ params }: PageProps<"/events/[slug]">) => {
  const { slug } = await params;

  return <PhotoFeed slug={slug} />;
};

export default page;
