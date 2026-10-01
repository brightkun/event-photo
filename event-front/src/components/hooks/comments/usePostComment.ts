import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

interface IPostParams {
  slug: string;
  photoId: string;
  token: string;
  text: string;
}

export const usePostComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, photoId, token, text }: IPostParams) => {
      const response = await api.post(
        `/events/${slug}/photos/${photoId}/comments`,
        { text },
        { headers: { "x-guest-token": token } },
      );
      return response.data.data;
    },
    onSuccess: (_data, { slug, photoId }) => {
      qc.invalidateQueries({ queryKey: ["comments", slug, photoId] });
      qc.invalidateQueries({ queryKey: ["photo", slug, photoId] });
    },
  });
};
