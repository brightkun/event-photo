import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

interface IGetResponse {
  message: string;
  data: IComment[];
}

export interface IComment {
  id: number;
  text: string;
  guest_name: string;
  created_at: string;
}

export const useGetComments = (slug: string, photoId: string) =>
  useQuery({
    queryKey: ["comments", slug, photoId],
    queryFn: async () => {
      const response = await api.get<IGetResponse>(
        `/events/${slug}/photos/${photoId}/comments`,
      );
      return response.data.data;
    },
  });
