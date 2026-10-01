import { supabase } from "./supabase";

// Сообщаем всем, у кого открыта страница события, что данные изменились.
// В сигнале нет данных: сайт сам перезапрашивает нужное. Ошибка сигнала
// никогда не ломает основной запрос, поэтому всё глушится.
export const notifyEvent = async (slug: string) => {
  if (!supabase) return;

  const channel = supabase.channel(`event:${slug}`);

  try {
    await Promise.race([
      channel.httpSend("changed", {}),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  } catch (error) {
    console.error("Realtime notify failed:", error);
  } finally {
    supabase.removeChannel(channel);
  }
};
