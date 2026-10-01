import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";

interface IPostBody {
  name: string;
}

interface IGuest {
  id: number;
  name: string;
  token: string;
  created_at: string;
}

interface IPostResponse {
  message: string;
  data: IGuest;
}

interface IPostParams {
  slug: string;
  body: IPostBody;
}

export const usePostGuest = () =>
  useMutation({
    mutationFn: async ({ slug, body }: IPostParams) => {
      const response = await api.post<IPostResponse>(
        `/events/${slug}/guests`,
        body,
      );
      return response.data.data;
    },
  });
