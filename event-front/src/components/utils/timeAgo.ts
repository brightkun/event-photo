import { Lang } from "@/components/store/settingsStore";

export const timeAgo = (date: string, lang: Lang) => {
  const ru = lang === "ru";
  const seconds = Math.max(0, (Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return ru ? "только что" : "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return ru ? `${minutes} мин назад` : `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return ru ? `${hours} ч назад` : `${hours} h ago`;

  const days = Math.floor(hours / 24);
  return ru ? `${days} дн назад` : `${days} d ago`;
};
