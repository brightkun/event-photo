"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

export type Lang = "en" | "ru";
// null значит «как в системе»
export type Theme = "light" | "dark" | null;

interface ISettings {
  lang: Lang;
  theme: Theme;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
}

const YEAR = 60 * 60 * 24 * 365;

const saveCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
};

// Свой store на каждого посетителя: на сервере общий store перемешал бы настройки разных людей
const createSettingsStore = (lang: Lang, theme: Theme) =>
  createStore<ISettings>()((set, get) => ({
    lang,
    theme,
    setLang: (next) => {
      saveCookie("lang", next);
      document.documentElement.lang = next;
      set({ lang: next });
    },
    toggleTheme: () => {
      const current = get().theme;
      const isDark =
        current === "dark" ||
        (current === null &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      const next = isDark ? "light" : "dark";

      saveCookie("theme", next);
      document.documentElement.dataset.theme = next;
      set({ theme: next });
    },
  }));

const SettingsContext = createContext<StoreApi<ISettings> | null>(null);

interface IProps {
  lang: Lang;
  theme: Theme;
  children: ReactNode;
}

export const SettingsProvider = ({ lang, theme, children }: IProps) => {
  const [store] = useState(() => createSettingsStore(lang, theme));

  return (
    <SettingsContext.Provider value={store}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = <T,>(selector: (state: ISettings) => T) => {
  const store = useContext(SettingsContext);

  if (!store) throw new Error("useSettings must be used inside SettingsProvider");

  return useStore(store, selector);
};
