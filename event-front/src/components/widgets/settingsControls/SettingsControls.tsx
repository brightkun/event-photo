"use client";

import { useT } from "@/components/i18n/useT";
import { Lang, useSettings } from "@/components/store/settingsStore";
import "./settingsControls.scss";

const langs: Lang[] = ["en", "ru"];

const SettingsControls = () => {
  const { t, lang } = useT();
  const setLang = useSettings((state) => state.setLang);
  const toggleTheme = useSettings((state) => state.toggleTheme);

  return (
    <div className="settingsControls">
      <div className="langs" role="group" aria-label={t.header.language}>
        {langs.map((item) => (
          <button
            key={item}
            className={item === lang ? "lang active" : "lang"}
            onClick={() => setLang(item)}
            aria-pressed={item === lang}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Иконка и подпись зависят от темы через CSS, поэтому не мигают при загрузке */}
      <button
        className="themeBtn"
        onClick={toggleTheme}
        aria-label={`${t.header.themeToDark} / ${t.header.themeToLight}`}
        title={`${t.header.themeToDark} / ${t.header.themeToLight}`}
      >
        <svg
          className="moon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <svg
          className="sun"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
    </div>
  );
};

export default SettingsControls;
