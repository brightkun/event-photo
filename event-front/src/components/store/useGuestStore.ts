import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IStoredGuest {
  id: number;
  name: string;
  token: string;
}

interface IGuestStore {
  guests: Record<string, IStoredGuest>;
  setGuest: (slug: string, guest: IStoredGuest) => void;
}

export const useGuestStore = create<IGuestStore>()(
  persist(
    (set) => ({
      guests: {},
      setGuest: (slug, guest) =>
        set((state) => ({ guests: { ...state.guests, [slug]: guest } })),
    }),
    { name: "guests" },
  ),
);
