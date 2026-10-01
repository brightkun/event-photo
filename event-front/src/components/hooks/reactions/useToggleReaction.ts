import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

interface IToggleParams {
  slug: string;
  photoId: string;
  token: string;
  emoji: string;
}

export const useToggleReaction = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, photoId, token, emoji }: IToggleParams) => {
      const response = await api.post(
        `/events/${slug}/photos/${photoId}/reactions`,
        { emoji },
        { headers: { "x-guest-token": token } },
      );
      return response.data.data;
    },
    onSuccess: (_data, { slug, photoId }) => {
      qc.invalidateQueries({ queryKey: ["photo", slug, photoId] });
      qc.invalidateQueries({ queryKey: ["photos", slug] });
    },
  });
};
