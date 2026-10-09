/**
 * Script test: Giả lập Facebook gửi POST webhook event.
 * Chạy: npm run test:webhook (khi server đang chạy)
 */

const WEBHOOK_URL = 'http://localhost:3000/webhook';

// Giả lập payload từ Facebook
const mockPayload = {
  object: 'page',
  entry: [
    {
      id: '123456789',
      time: Date.now(),
      messaging: [
        {
          sender: { id: '9999999999' },
          recipient: { id: '123456789' },
          timestamp: Date.now(),
          message: {
            mid: 'mid.test123',
            text: 'Xin chào bot!',
          },
        },
      ],
    },
  ],
};

async function testWebhook() {
  console.log('🧪 Gửi mock webhook event tới', WEBHOOK_URL);
  console.log('📦 Payload:', JSON.stringify(mockPayload, null, 2));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });

    console.log(`\n📬 Response status: ${response.status}`);
    const text = await response.text();
    console.log(`📝 Response body: ${text}`);

    if (response.status === 200) {
      console.log('\n✅ Webhook nhận event thành công!');
      console.log('💡 Kiểm tra terminal server để xem log tin nhắn.');
      console.log('⚠️  sendTextMessage sẽ fail vì PAGE_ACCESS_TOKEN chưa valid — đó là bình thường khi test local.');
    } else {
      console.log('\n❌ Webhook trả lỗi.');
    }
  } catch (error) {
    console.error('\n❌ Không thể kết nối tới server:', error.message);
    console.log('💡 Đảm bảo server đang chạy: npm run dev');
  }
}

testWebhook();
