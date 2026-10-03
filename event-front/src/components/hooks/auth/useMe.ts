import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

interface IGetResponse {
  message: string;
  data: IUser | null;
}

// Кто сейчас вошёл. Если никто, вернётся null (это не ошибка).
export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<IGetResponse>("/auth/me");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
