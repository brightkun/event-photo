import GuestJoin from "@/components/pages/guestJoin/GuestJoin";

const page = async ({ params }: PageProps<"/join/[slug]">) => {
  const { slug } = await params;

  return <GuestJoin slug={slug} />;
};

export default page;
