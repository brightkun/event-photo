import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

interface IGetResponse {
  message: string;
  data: IEvent;
}

export interface IEvent {
  id: number;
  slug: string;
  name: string;
  date: string;
  location: string;
  created_at: string;
  photos_count: number;
  guests_count: number;
}

export const useGetEvent = (slug: string) =>
  useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const response = await api.get<IGetResponse>(`/events/${slug}`);
      return response.data.data;
    },
  });
