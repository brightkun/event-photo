import { SettingsProvider } from "@/components/store/settingsStore";
import { getServerSettings } from "@/components/utils/serverSettings";
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout.c";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

// У Instrument Serif нет кириллицы: для русских букв браузер возьмёт запасной шрифт с засечками (см. --font-display-serif)
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const { lang } = await getServerSettings();

  return {
    title: "Event Photo Mall",
    description:
      lang === "ru"
        ? "Создайте событие, получите QR-код и делитесь фото в одной живой ленте"
        : "Create an event, get a QR code and share photos in one live feed",
  };
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang, theme } = await getServerSettings();

  return (
    <html
      lang={lang}
      data-theme={theme ?? undefined}
      className={`${inter.variable} ${display.variable}`}
    >
      <body>
        <SettingsProvider lang={lang} theme={theme}>
          <LayoutClient>{children}</LayoutClient>
        </SettingsProvider>
      </body>
    </html>
  );
}
