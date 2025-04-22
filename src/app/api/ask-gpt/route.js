import { openai } from '@/lib/openai';

export async function POST(req) {
  const { question } = await req.json();

  const res = await openai.chat.completions.create({
    model: 'openai/gpt-3.5-turbo', // <- perhatikan format!
    messages: [
      {
        role: 'system',
        content: `
          Kau adalah AI Kristian. Jawab hanya topik Alkitab & iman.
          Kalau user tanya benda bukan rohani, jawab sopan:
          "Maaf, saya hanya bantu hal berkaitan Firman Tuhan dan iman."
        `
      },
      {
        role: 'user',
        content: question
      }
    ]
  });

  return Response.json({ answer: res.choices[0].message.content });
}
