import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "./useMe";

// Для закрытых страниц: без входа отправляет на /login, не-admin с adminOnly уводит на /account.
export const useRequireUser = (adminOnly = false) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (adminOnly && user.role !== "admin") replace("/account");
  }, [isLoading, user, adminOnly, pathname, replace]);

  const allowed = !!user && (!adminOnly || user.role === "admin");

  return { user: allowed ? user : null, isLoading: isLoading || !allowed };
};
