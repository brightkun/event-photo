import { SettingsProvider } from "@/components/store/settingsStore";
import { getServerSettings } from "@/components/utils/serverSettings";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout.c";

// Один шрифт на весь сайт. Курсив нужен для акцента в заголовке лендинга.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
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
      className={montserrat.variable}
    >
      <body>
        <SettingsProvider lang={lang} theme={theme}>
          <LayoutClient>{children}</LayoutClient>
        </SettingsProvider>
      </body>
    </html>
  );
}
