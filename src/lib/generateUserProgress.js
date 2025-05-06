import { supabase } from '@/lib/supabaseClient';

export async function generateUserProgress(userId) {
  // 1. Check kalau user sudah ada progress
  const { data: existing, error: checkError } = await supabase
    .from('reading_progress')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking existing progress:', checkError.message);
    return;
  }

  if (existing && existing.length > 0) {
    console.log('✅ Progress sudah wujud, tidak perlu generate lagi.');
    return;
  }

  // 2. Dapatkan semua chapter dari table `chapters`
  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('book_name, chapter_number');

  if (error) {
    console.error('❌ Error fetch chapters:', error.message);
    return;
  }

  // 3. Sediakan data untuk insert
  const insertData = chapters.map((chapter) => ({
    user_id: userId,
    book_name: chapter.book_name,
    chapter_number: chapter.chapter_number,
    is_read: false,
  }));

  // 4. Insert semua ke dalam reading_progress
  const { error: insertError } = await supabase
    .from('reading_progress')
    .insert(insertData);

  if (insertError) {
    console.error('❌ Gagal insert reading progress:', insertError.message);
  } else {
    console.log('✅ Berjaya generate 1189 progress untuk user');
  }
}
