import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../api/api";
import { IUser } from "./useMe";

interface ILoginBody {
  email: string;
  password: string;
}

interface IRegisterBody extends ILoginBody {
  name: string;
}

interface IAuthResponse {
  message: string;
  data: IUser;
}

// Куда вести после входа: адрес из ?next=..., но только свой (начинается с одного "/")
const getNextPath = () => {
  const next = new URLSearchParams(window.location.search).get("next");

  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/account";
};

export const useLogin = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();

  return useMutation({
    mutationFn: async (body: ILoginBody) => {
      const response = await api.post<IAuthResponse>("/auth/login", body);
      return response.data.data;
    },
    onSuccess: (user) => {
      qc.setQueryData(["me"], user);
      replace(getNextPath());
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();

  return useMutation({
    mutationFn: async (body: IRegisterBody) => {
      const response = await api.post<IAuthResponse>("/auth/register", body);
      return response.data.data;
    },
    onSuccess: (user) => {
      qc.setQueryData(["me"], user);
      replace(getNextPath());
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  const { push } = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      qc.removeQueries({ queryKey: ["myEvents"] });
      qc.removeQueries({ queryKey: ["admin"] });
      push("/");
    },
  });
};
