import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Адрес сайта берём из адресной строки, поэтому QR всегда ведёт туда, где открыт сайт
// (localhost, IP в Wi-Fi или адрес туннеля). На сервере возвращается пустая строка.
export const useOrigin = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => "",
  );
