import { getHistory, addMessage, removeLastMessage, clearHistory } from './historyService.js';

/**
 * Service gọi Google Gemini API với bộ nhớ ngữ cảnh nhiều lượt (multi-turn conversation).
 *
 * @param {string} userPrompt - Nội dung tin nhắn của người dùng
 * @param {string} userId - ID người dùng Facebook (PSID) để phân biệt ngữ cảnh
 * @returns {Promise<string>} Câu trả lời từ AI
 */
export async function generateGeminiReply(userPrompt, userId = 'default') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY chưa được thiết lập trên server. Đang fallback về Echo.');
    return `Bạn vừa nói: "${userPrompt}"`;
  }

  // Hỗ trợ lệnh reset ngữ cảnh chủ động khi người dùng muốn bắt đầu chủ đề mới
  const normalized = userPrompt.trim().toLowerCase();
  if (['/reset', '/clear', 'xóa lịch sử', 'xoa lich su', 'làm mới', 'lam moi'].includes(normalized)) {
    clearHistory(userId);
    return '🧹 Mình đã làm mới bộ nhớ và xóa ngữ cảnh cuộc trò chuyện cũ rồi nha! Bạn muốn trao đổi về chủ đề gì mới nào? ✨';
  }

  // Thêm tin nhắn của user vào lịch sử cuộc trò chuyện
  addMessage(userId, 'user', userPrompt);
  const conversationHistory = getHistory(userId);

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

  for (const model of models) {
    try {
      console.log(`🤖 Đang gọi mô hình ${model} cho user ${userId} (${conversationHistory.length} messages in context)...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: 'Bạn là một trợ lý AI thông minh, thân thiện trên Facebook Messenger. Hãy chú ý ghi nhớ các thông tin và ngữ cảnh trong các câu trò chuyện trước đó của người dùng để trả lời đúng trọng tâm, ngắn gọn, tự nhiên và hữu ích.',
              },
            ],
          },
          contents: conversationHistory,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Model ${model} trả lỗi:`, err);
        continue; // Thử model dự phòng tiếp theo
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        console.log(`✅ ${model} trả lời thành công:`, reply.substring(0, 80));
        // Lưu câu trả lời của AI vào bộ nhớ ngữ cảnh để phục vụ các câu hỏi tiếp theo
        addMessage(userId, 'model', reply);
        return reply.length > 1900 ? reply.substring(0, 1900) + '...' : reply;
      }
    } catch (err) {
      console.error(`❌ Exception với ${model}:`, err.message);
    }
  }

  // Nếu API lỗi, rút lại tin nhắn của user để bảo toàn tính toàn vẹn (cặp user/model)
  removeLastMessage(userId);
  return `Bạn vừa nói: "${userPrompt}"`;
}
