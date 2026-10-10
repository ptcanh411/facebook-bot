/**
 * Service quản lý bộ nhớ ngữ cảnh trò chuyện theo từng người dùng (PSID).
 */

// Lưu trữ các phiên chat trong bộ nhớ RAM
const sessions = new Map();

// Cấu hình
const MAX_MESSAGES = 20; // Giữ tối đa 20 tin nhắn gần nhất (10 lượt trao đổi)
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // Tự động xóa ngữ cảnh nếu không chat trong 1 tiếng

/**
 * Lấy lịch sử tin nhắn của một người dùng.
 * @param {string} userId - Facebook PSID
 * @returns {Array} Danh sách tin nhắn dạng [{ role: 'user'|'model', parts: [{ text }] }]
 */
export function getHistory(userId) {
  const session = sessions.get(userId);
  if (!session) return [];

  // Tự động làm mới nếu đã quá 1 tiếng không hoạt động
  if (Date.now() - session.lastActive > SESSION_TIMEOUT_MS) {
    sessions.delete(userId);
    return [];
  }

  return session.messages;
}

/**
 * Thêm tin nhắn mới vào lịch sử trò chuyện của người dùng.
 * @param {string} userId - Facebook PSID
 * @param {'user'|'model'} role - Vai trò ('user' hoặc 'model')
 * @param {string} text - Nội dung tin nhắn
 */
export function addMessage(userId, role, text) {
  let session = sessions.get(userId);
  if (!session || Date.now() - session.lastActive > SESSION_TIMEOUT_MS) {
    session = { lastActive: Date.now(), messages: [] };
    sessions.set(userId, session);
  }

  session.lastActive = Date.now();
  session.messages.push({
    role,
    parts: [{ text }],
  });

  // Cắt bớt nếu vượt quá số lượng tin nhắn tối đa
  if (session.messages.length > MAX_MESSAGES) {
    session.messages = session.messages.slice(-MAX_MESSAGES);
  }
}

/**
 * Xóa tin nhắn cuối cùng (dùng khi API lỗi để tránh lệch cặp user/model).
 * @param {string} userId - Facebook PSID
 */
export function removeLastMessage(userId) {
  const session = sessions.get(userId);
  if (session && session.messages.length > 0) {
    session.messages.pop();
  }
}

/**
 * Xóa toàn bộ lịch sử trò chuyện của một người dùng.
 * @param {string} userId - Facebook PSID
 */
export function clearHistory(userId) {
  sessions.delete(userId);
}
