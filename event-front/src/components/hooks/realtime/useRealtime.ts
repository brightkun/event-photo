import { createClient } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Публичный ключ нужен только для приёма сигналов; данные через него не читаются.
const supabase =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const QUERY_KEYS = ["event", "photos", "photo", "comments"];

// Бэк шлёт сигнал «changed» при любом изменении в событии,
// после него перезапрашиваем данные. Если ключей нет, хук ничего не делает.
export const useRealtime = (slug: string) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`event:${slug}`)
      .on("broadcast", { event: "changed" }, () => {
        QUERY_KEYS.forEach((key) =>
          qc.invalidateQueries({ queryKey: [key, slug] }),
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, qc]);
};
