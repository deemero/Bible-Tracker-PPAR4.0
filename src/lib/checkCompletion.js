// src/lib/checkCompletion.js
import { supabase } from '@/lib/supabaseClient';

export async function checkAndHandleCompletion(userId) {
  // Step 1: Fetch semua ticked chapters
  const { data: readChapters, error: readErr } = await supabase
    .from('reading_progress')
    .select('book_name, chapter_number')
    .eq('user_id', userId)
    .eq('is_read', true);

  // Step 2: Fetch total chapters dalam Bible
  const { data: allChapters, error: allErr } = await supabase
    .from('chapters')
    .select('book_name, chapter_number');

  if (!readChapters || !allChapters) {
    console.error('Fetch error:', readErr || allErr);
    return false;
  }

  // Step 3: Normalize dan kira progress sebenar
  const uniqueTicked = new Set(
    readChapters.map(d => `${d.book_name.toLowerCase()}-${d.chapter_number}`)
  );

  const allChapterKeys = allChapters.map(c => `${c.book_name.toLowerCase()}-${c.chapter_number}`);
  const totalBibleChapters = allChapterKeys.length;

  if (uniqueTicked.size === totalBibleChapters) {
    console.log('✅ Semua sudah tick! Updating...');

    // Step 4: RPC untuk rekodkan completion
    const { error: incrementError } = await supabase.rpc('increment_completion', { uid: userId });
    if (incrementError) {
      console.error("RPC Error:", incrementError);
      return false;
    }

    // Step 5: Reset tick
    const { error: resetErr } = await supabase
      .from('reading_progress')
      .update({ is_read: false })
      .eq('user_id', userId);

    if (resetErr) {
      console.error('Reset error:', resetErr);
      return false;
    }

    return true;
  } else {
    console.log(`Belum cukup: ${uniqueTicked.size} / ${totalBibleChapters}`);
    return false;
  }
}
