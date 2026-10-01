import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";

interface IPostBody {
  name: string;
  date: string;
  location: string;
}

interface IEvent {
  id: number;
  slug: string;
  name: string;
  date: string;
  location: string;
  created_at: string;
}

interface IPostResponse {
  message: string;
  data: IEvent;
}

export const usePostEvent = () =>
  useMutation({
    mutationFn: async (body: IPostBody) => {
      const response = await api.post<IPostResponse>("/events", body);
      return response.data.data;
    },
  });
