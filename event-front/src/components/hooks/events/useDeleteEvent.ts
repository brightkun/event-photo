import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

export const useDeleteEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await api.delete(`/events/${slug}`);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myEvents"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};
