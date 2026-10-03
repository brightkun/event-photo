import { Lang } from "@/components/store/settingsStore";

export const formatDate = (date: string, lang: Lang) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
