import { Lang } from "@/components/store/settingsStore";

// forms: [одна, несколько, много], например ["гость", "гостя", "гостей"].
// Для английского достаточно двух форм: ["guest", "guests"].
export const plural = (count: number, forms: string[], lang: Lang) => {
  if (lang === "en") return count === 1 ? forms[0] : forms[1];

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};
