import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Один клиент Supabase на бэке: и для Storage, и для сигналов Realtime.
export const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } },
      )
    : null;
