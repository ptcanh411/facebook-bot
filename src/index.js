import 'dotenv/config';
import express from 'express';
import webhookRouter from './routes/webhook.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body từ Facebook webhook
app.use(express.json());

// Route chính - health check
app.get('/', (req, res) => {
  res.send('🤖 Facebook Messenger Echo Bot is running!');
});

// Privacy Policy URL (bắt buộc cho Facebook App)
app.get('/privacy-policy', (req, res) => {
  res.send(`
    <html>
      <head><title>Chính sách quyền riêng tư - Facebook Messenger Bot</title></head>
      <body style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Chính sách quyền riêng tư (Privacy Policy)</h1>
        <p>Ứng dụng này chỉ phục vụ mục đích thử nghiệm bot Messenger.</p>
        <p>Chúng tôi không thu thập, lưu trữ hay chia sẻ bất kỳ thông tin cá nhân nào của người dùng với bên thứ ba.</p>
        <p>Mọi dữ liệu tin nhắn chỉ được sử dụng tạm thời trong bộ nhớ để phản hồi (echo) tin nhắn của người dùng.</p>
      </body>
    </html>
  `);
});

// Terms of Service (Điều khoản dịch vụ)
app.get('/terms', (req, res) => {
  res.send(`
    <html>
      <head><title>Điều khoản dịch vụ - Facebook Messenger Bot</title></head>
      <body style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Điều khoản dịch vụ (Terms of Service)</h1>
        <p>Đây là bot thử nghiệm echo tin nhắn trên nền tảng Facebook Messenger.</p>
      </body>
    </html>
  `);
});

// User Data Deletion (Xóa dữ liệu người dùng)
app.all('/data-deletion', (req, res) => {
  if (req.method === 'POST') {
    return res.json({
      url: 'https://facebook-bot-8w03.onrender.com/data-deletion',
      confirmation_code: 'del_' + Date.now(),
    });
  }
  res.send(`
    <html>
      <head><title>Xóa dữ liệu - Facebook Messenger Bot</title></head>
      <body style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Yêu cầu xóa dữ liệu</h1>
        <p>Bot không lưu trữ dữ liệu người dùng. Nếu bạn muốn xóa dữ liệu liên kết, vui lòng ngắt kết nối bot trong cài đặt Messenger của bạn.</p>
      </body>
    </html>
  `);
});

// Mount webhook routes
app.use('/webhook', webhookRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
});
