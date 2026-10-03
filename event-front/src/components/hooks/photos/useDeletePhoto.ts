import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

interface IDeleteParams {
  slug: string;
  photoId: string;
  token?: string;
}

export const useDeletePhoto = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, photoId, token }: IDeleteParams) => {
      const response = await api.delete(`/events/${slug}/photos/${photoId}`, {
        headers: token ? { "x-guest-token": token } : {},
      });
      return response.data;
    },
    onSuccess: (_data, { slug }) => {
      qc.invalidateQueries({ queryKey: ["photos", slug] });
      qc.invalidateQueries({ queryKey: ["event", slug] });
    },
  });
};
