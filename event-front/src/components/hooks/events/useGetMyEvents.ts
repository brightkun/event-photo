import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { IEvent } from "./useGetEvent";

interface IGetResponse {
  message: string;
  data: IEvent[];
}

export const useGetMyEvents = (enabled: boolean) =>
  useQuery({
    queryKey: ["myEvents"],
    queryFn: async () => {
      const response = await api.get<IGetResponse>("/account/events");
      return response.data.data;
    },
    enabled,
  });
