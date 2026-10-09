import { sendTextMessage } from '../services/messengerService.js';
import { generateGeminiReply } from '../services/geminiService.js';

/**
 * GET /webhook
 * Xác minh webhook với Facebook Platform.
 * Facebook gửi hub.mode, hub.verify_token, hub.challenge.
 * Nếu token khớp → trả về challenge.
 */
export function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified thành công!');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Webhook verification thất bại. Token không khớp.');
  return res.sendStatus(403);
}

/**
 * POST /webhook
 * Nhận message event từ Facebook.
 * Luôn trả 200 ngay lập tức, xử lý message bất đồng bộ.
 */
export function handleIncomingMessage(req, res) {
  const body = req.body;

  if (body.object !== 'page') {
    return res.sendStatus(404);
  }

  // Trả 200 ngay để Facebook không retry
  res.status(200).send('EVENT_RECEIVED');

  // Xử lý từng entry bất đồng bộ
  body.entry.forEach((entry) => {
    const messagingEvents = entry.messaging || [];

    messagingEvents.forEach(async (event) => {
      const senderPsid = event.sender?.id;

      if (!senderPsid) return;

      // Chỉ xử lý text message (bỏ qua postback, attachment, v.v.)
      if (event.message?.text) {
        const receivedText = event.message.text;

        console.log(`📩 Nhận tin nhắn từ ${senderPsid}: "${receivedText}"`);

        try {
          // Tạo câu trả lời thông minh qua Gemini AI (hoặc fallback về echo nếu chưa có key)
          const replyText = await generateGeminiReply(receivedText);
          await sendTextMessage(senderPsid, replyText);
          console.log(`📤 Đã gửi phản hồi cho ${senderPsid}`);
        } catch (error) {
          console.error(`❌ Lỗi khi gửi tin nhắn cho ${senderPsid}:`, error.message);
        }
      }
    });
  });
}
