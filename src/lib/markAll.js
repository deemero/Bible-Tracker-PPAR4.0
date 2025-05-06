import { supabase } from "@/lib/supabaseClient";

// Tandakan semua chapter sebagai sudah baca
export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from("reading_progress")
    .update({ is_read: true })
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Gagal tick semua:", error.message);
    return false;
  }

  return true;
}
