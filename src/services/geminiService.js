/**
 * Service gọi Google Gemini API để tạo câu trả lời thông minh.
 */
export async function generateGeminiReply(userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Nếu chưa cấu hình API key, fallback về echo
    return `Bạn vừa nói: "${userPrompt}"`;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Bạn là trợ lý AI thân thiện trên Facebook Messenger. Hãy trả lời ngắn gọn, tự nhiên, súc tích và hữu ích cho câu hỏi sau:\n${userPrompt}`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Lỗi Gemini API:', errorData);
      return `Bạn vừa nói: "${userPrompt}"`;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      // Facebook Messenger giới hạn tối đa 2000 ký tự cho mỗi tin nhắn
      return reply.length > 1900 ? reply.substring(0, 1900) + '...' : reply;
    }

    return `Bạn vừa nói: "${userPrompt}"`;
  } catch (error) {
    console.error('❌ Exception khi gọi Gemini:', error.message);
    return `Bạn vừa nói: "${userPrompt}"`;
  }
}
