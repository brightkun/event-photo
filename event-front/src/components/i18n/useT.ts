import { useSettings } from "@/components/store/settingsStore";
import { en } from "./en";
import { ru } from "./ru";

const dictionaries = { en, ru };

// Тексты на текущем языке: const { t, lang } = useT(); t.header.login
export const useT = () => {
  const lang = useSettings((state) => state.lang);

  return { t: dictionaries[lang], lang };
};
