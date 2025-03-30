import { supabase } from "@/lib/supabaseClient";

export async function updateStreak(userId) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from("profiles")
    .select("last_reading_date, reading_streak")
    .eq("id", userId)
    .single();

  if (error || !data) return;

  const lastDate = data.last_reading_date;
  const streak = data.reading_streak || 0;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = streak;

  if (lastDate === today) {
    return;
  } else if (lastDate === yesterdayStr) {
    newStreak = streak + 1;
  } else {
    newStreak = 1;
  }

  await supabase
    .from("profiles")
    .update({
      reading_streak: newStreak,
      last_reading_date: today,
    })
    .eq("id", userId);
}
