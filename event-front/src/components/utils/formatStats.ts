import { Lang } from "@/components/store/settingsStore";
import { plural } from "./plural";

export const formatStats = (photos: number, guests: number, lang: Lang) =>
  lang === "ru"
    ? `${photos} фото · ${guests} ${plural(guests, ["гость", "гостя", "гостей"], lang)}`
    : `${photos} ${plural(photos, ["photo", "photos"], lang)} · ${guests} ${plural(guests, ["guest", "guests"], lang)}`;
