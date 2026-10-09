/**
 * Service gọi Google Gemini API để tạo câu trả lời thông minh.
 */
export async function generateGeminiReply(userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY chưa được thiết lập trên server. Đang fallback về Echo.');
    return `Bạn vừa nói: "${userPrompt}"`;
  }

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

  for (const model of models) {
    try {
      console.log(`🤖 Đang gọi mô hình ${model}...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Bạn là một trợ lý AI thông minh, thân thiện trên Facebook Messenger. Hãy trả lời ngắn gọn, tự nhiên, súc tích và hữu ích cho câu sau:\n${userPrompt}`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Model ${model} trả lỗi:`, err);
        continue; // Thử model tiếp theo
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        console.log(`✅ ${model} trả lời thành công:`, reply.substring(0, 80));
        return reply.length > 1900 ? reply.substring(0, 1900) + '...' : reply;
      }
    } catch (err) {
      console.error(`❌ Exception với ${model}:`, err.message);
    }
  }

  return `Bạn vừa nói: "${userPrompt}"`;
}
