import { supabase } from '@/lib/supabaseClient';

export async function checkAndHandleCompletion(userId) {
  // ✅ Step 1: Fetch semua ticked chapters (loop untuk >1000)
  let readChapters = [];
  let start = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('book_name, chapter_number')
      .eq('user_id', userId)
      .eq('is_read', true)
      .range(start, start + limit - 1);

    if (error) {
      console.error("❌ Fetch ticked chapters error:", error);
      return false;
    }

    if (data.length > 0) {
      readChapters = [...readChapters, ...data];
      start += limit;
      hasMore = data.length === limit;
    } else {
      hasMore = false;
    }
  }
// ✅ Step 2: Fetch all chapters from `chapters` table (loop untuk >1000)
let allChapters = [];
let chapterStart = 0;
const chapterLimit = 1000;
let chapterHasMore = true;

while (chapterHasMore) {
  const { data, error } = await supabase
    .from('chapters')
    .select('book_name, chapter_number') // ✅ UBAH SINI
    .range(chapterStart, chapterStart + chapterLimit - 1);

  if (error) {
    console.error("❌ Fetch chapters error:", error);
    return false;
  }

  if (data.length > 0) {
    allChapters = [...allChapters, ...data];
    chapterStart += chapterLimit;
    chapterHasMore = data.length === chapterLimit;
  } else {
    chapterHasMore = false;
  }
}

  // ✅ Step 3: Buang duplikat & kira progress sebenar
  const uniqueTicked = new Set(readChapters.map(d => `${d.book_name}-${d.chapter_number}`));
  const totalTicked = uniqueTicked.size;
  const totalBibleChapters = allChapters.length;

  console.log("✅ Checked:", totalTicked, "/", totalBibleChapters);

  if (totalTicked === totalBibleChapters) {
    console.log('✅ Semua sudah tick! Updating rekod...');

    // ✅ Step 4: Call RPC untuk rekod completion
    const { error: incrementError } = await supabase.rpc('increment_completion', { uid: userId });
    if (incrementError) {
      console.error("❌ RPC Error:", incrementError);
      return false;
    }

    // ✅ Step 5: Reset semua tick
    const { error: resetErr } = await supabase
      .from('reading_progress')
      .update({ is_read: false })
      .eq('user_id', userId);

    if (resetErr) {
      console.error("❌ Reset error:", resetErr);
      return false;
    }

    return true;
  } else {
    console.log("⏳ Belum cukup:", totalTicked, "/", totalBibleChapters);
    return false;
  }
}
