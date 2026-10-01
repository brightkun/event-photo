import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

interface IGetResponse {
  message: string;
  data: IPhotoDetail;
}

export interface IReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface IPhotoDetail {
  id: number;
  url: string;
  width: number;
  height: number;
  guest_name: string;
  is_owner: boolean;
  comments_count: number;
  reactions: IReaction[];
  created_at: string;
}

export const useGetPhoto = (slug: string, photoId: string, token?: string) =>
  useQuery({
    queryKey: ["photo", slug, photoId, token ?? null],
    queryFn: async () => {
      const response = await api.get<IGetResponse>(
        `/events/${slug}/photos/${photoId}`,
        { headers: token ? { "x-guest-token": token } : {} },
      );
      return response.data.data;
    },
  });
