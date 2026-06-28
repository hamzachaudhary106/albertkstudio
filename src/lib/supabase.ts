import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once the Supabase env vars are present — gates the live booking flow. */
export const isBookingConfigured = Boolean(url && anonKey);

export const supabaseUrl = url ?? "";
export const supabaseAnonKey = anonKey ?? "";

// A single client instance. Falls back to harmless placeholders when unconfigured
// so the app still builds/runs (the booking UI shows a "call us" fallback).
export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
);
