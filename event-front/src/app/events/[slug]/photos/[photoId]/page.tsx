import PhotoDetail from "@/components/pages/photoDetail/PhotoDetail";

const page = async ({
  params,
}: PageProps<"/events/[slug]/photos/[photoId]">) => {
  const { slug, photoId } = await params;

  return <PhotoDetail slug={slug} photoId={photoId} />;
};

export default page;
