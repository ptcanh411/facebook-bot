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

// Mount webhook routes
app.use('/webhook', webhookRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
});
