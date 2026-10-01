import { useGuestStore } from "@/components/store/useGuestStore";
import { useRouter } from "next/navigation";

export const useGuest = (slug: string) => {
  const { push } = useRouter();
  const guest = useGuestStore((state) => state.guests[slug]);

  const requireGuest = () => {
    if (!guest) push(`/join/${slug}`);
    return guest;
  };

  return { guest, requireGuest };
};
