const GRAPH_API_URL = 'https://graph.facebook.com/v21.0/me/messages';

/**
 * Gửi tin nhắn text tới người dùng qua Facebook Send API.
 *
 * @param {string} recipientPsid - Page-Scoped ID của người nhận
 * @param {string} text - Nội dung tin nhắn cần gửi
 * @returns {Promise<object>} Response từ Graph API
 */
export async function sendTextMessage(recipientPsid, text) {
  const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;

  if (!pageAccessToken) {
    throw new Error('PAGE_ACCESS_TOKEN chưa được cấu hình trong .env');
  }

  const requestBody = {
    recipient: { id: recipientPsid },
    message: { text },
  };

  const response = await fetch(`${GRAPH_API_URL}?access_token=${pageAccessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Graph API Error: ${JSON.stringify(data.error)}`);
  }

  return data;
}
