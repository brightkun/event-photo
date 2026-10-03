import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export interface IAdminStats {
  users_count: number;
  events_count: number;
  photos_count: number;
  comments_count: number;
}

export interface IAdminEvent {
  id: number;
  slug: string;
  name: string;
  date: string;
  location: string;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  photos_count: number;
  guests_count: number;
}

export interface IAdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  events_count: number;
}

const useAdminQuery = <T>(key: string, path: string, enabled: boolean) =>
  useQuery({
    queryKey: ["admin", key],
    queryFn: async () => {
      const response = await api.get<{ message: string; data: T }>(
        `/admin/${path}`,
      );
      return response.data.data;
    },
    enabled,
  });

export const useAdminStats = (enabled: boolean) =>
  useAdminQuery<IAdminStats>("stats", "stats", enabled);

export const useAdminEvents = (enabled: boolean) =>
  useAdminQuery<IAdminEvent[]>("events", "events", enabled);

export const useAdminUsers = (enabled: boolean) =>
  useAdminQuery<IAdminUser[]>("users", "users", enabled);
