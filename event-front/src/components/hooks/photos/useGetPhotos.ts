import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

interface IGetResponse {
  message: string;
  data: IPhoto[];
}

export interface IPhoto {
  id: number;
  url: string;
  width: number;
  height: number;
  guest_name: string;
  top_emoji: string | null;
  top_count: number | null;
  created_at: string;
}

export const useGetPhotos = (slug: string) =>
  useQuery({
    queryKey: ["photos", slug],
    queryFn: async () => {
      const response = await api.get<IGetResponse>(`/events/${slug}/photos`);
      return response.data.data;
    },
  });
