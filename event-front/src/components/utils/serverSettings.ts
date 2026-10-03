import { Lang, Theme } from "@/components/store/settingsStore";
import { cookies, headers } from "next/headers";

// Язык и тема для серверной отрисовки: сначала выбор из cookie,
// потом язык браузера (Accept-Language), тема «как в системе».
export const getServerSettings = async () => {
  const cookieStore = await cookies();
  const headerList = await headers();

  const savedLang = cookieStore.get("lang")?.value;
  const browserLang = headerList.get("accept-language")?.toLowerCase() ?? "";

  const lang: Lang =
    savedLang === "ru" || savedLang === "en"
      ? savedLang
      : browserLang.startsWith("ru")
        ? "ru"
        : "en";

  const savedTheme = cookieStore.get("theme")?.value;
  const theme: Theme =
    savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;

  return { lang, theme };
};
