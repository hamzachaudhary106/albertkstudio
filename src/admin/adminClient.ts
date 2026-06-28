import { supabase } from "../lib/supabase";

export { supabase };

/** Upload an image to the public `media` bucket and return its public URL. */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
