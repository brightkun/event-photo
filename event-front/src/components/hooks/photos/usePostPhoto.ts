import { prepareImage } from "@/components/utils/prepareImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

interface IPostParams {
  slug: string;
  token: string;
  file: File;
}

export const usePostPhoto = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, token, file }: IPostParams) => {
      const image = await prepareImage(file);

      const formData = new FormData();
      formData.append("photo", image.blob, image.name);
      formData.append("width", String(image.width));
      formData.append("height", String(image.height));

      const response = await api.post(`/events/${slug}/photos`, formData, {
        headers: { "x-guest-token": token },
      });
      return response.data.data;
    },
    onSuccess: (_data, { slug }) => {
      qc.invalidateQueries({ queryKey: ["photos", slug] });
      qc.invalidateQueries({ queryKey: ["event", slug] });
    },
  });
};
