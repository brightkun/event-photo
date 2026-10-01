import EventReady from "@/components/pages/eventReady/EventReady";

const page = async ({ params }: PageProps<"/events/[slug]/ready">) => {
  const { slug } = await params;

  return <EventReady slug={slug} />;
};

export default page;
