# 🤖 Facebook Messenger Echo Bot

Bot Messenger đơn giản — nhận tin nhắn từ người dùng và **echo** (gửi lại) nội dung tin nhắn đó.

## ✨ Tính năng

- Nhận tin nhắn text từ người dùng qua Facebook Messenger
- Tự động echo lại nội dung: `Bạn vừa nói: "..."` 
- Webhook verification với Facebook Platform
- Kiến trúc MVC rõ ràng (Routes → Controllers → Services)

## 📋 Yêu cầu

- **Node.js** v18+ (khuyến nghị v20+)
- **Facebook App** đã tạo trên [developers.facebook.com](https://developers.facebook.com)
- **Facebook Page** để liên kết bot
- **HTTPS** — dùng cloud hosting (Render, Railway, Heroku...) hoặc ngrok cho dev local

## 🚀 Cài đặt

### 1. Clone & cài dependencies

```bash
git clone <repo-url>
cd facebook-chat-bot
npm install
```

### 2. Cấu hình biến môi trường

Copy file mẫu và điền thông tin:

```bash
cp .env.example .env
```

Mở `.env` và sửa:

```env
PORT=3000
VERIFY_TOKEN=my_secret_verify_token    # Token tự đặt, dùng khi setup webhook
PAGE_ACCESS_TOKEN=EAAxxxxxxx           # Lấy từ Facebook Developer Console
```

### 3. Lấy Page Access Token

1. Vào [Facebook Developer Console](https://developers.facebook.com/apps)
2. Chọn App của bạn → **Messenger** → **Settings**
3. Ở mục **Access Tokens**, chọn Page → **Generate Token**
4. Copy token và paste vào `.env`

## 🔗 Setup Webhook trên Facebook

### Deploy lên Cloud

1. Deploy project lên cloud service (Render, Railway, Heroku, v.v.)
2. Lấy URL public, ví dụ: `https://your-app.onrender.com`

### Cấu hình trên Facebook Developer Console

1. Vào App Dashboard → **Webhooks** → **Add Subscription**
2. Chọn **Page**
3. Điền:
   - **Callback URL**: `https://your-app.onrender.com/webhook`
   - **Verify Token**: Giống `VERIFY_TOKEN` trong `.env`
4. Nhấn **Verify and Save**
5. Subscribe các fields: `messages`, `messaging_postbacks`

## 🏃 Chạy server

```bash
# Development (auto-reload khi sửa code)
npm run dev

# Production
npm start
```

## 🧪 Test

Khi server đang chạy, mở terminal khác:

```bash
# Test mock webhook
npm run test:webhook
```

Hoặc test webhook verification bằng curl:

```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=my_secret_verify_token&hub.challenge=test123"
# Expected: test123
```

## 📁 Cấu trúc dự án

```
facebook-chat-bot/
├── src/
│   ├── index.js                    # Entry point - Express server
│   ├── routes/
│   │   └── webhook.js              # GET & POST /webhook routes
│   ├── controllers/
│   │   └── messengerController.js  # Xử lý verify & incoming messages
│   └── services/
│       └── messengerService.js     # Gọi Facebook Graph API
├── test/
│   └── mock-webhook.js             # Script test webhook local
├── .env.example                    # Mẫu biến môi trường
├── .gitignore
├── package.json
├── AGENTS.md                       # Hướng dẫn cho AI agents
└── README.md                       # File này
```

## 🔄 Luồng hoạt động

```
Người dùng gửi "Xin chào!" trên Messenger
        ↓
Facebook POST /webhook → Server nhận message payload
        ↓
Controller parse sender ID + text
        ↓
Service gọi Graph API: POST /me/messages
        ↓
Bot trả lời: Bạn vừa nói: "Xin chào!"
```

## 🚀 Deploy lên Cloud

### Render

1. Push code lên GitHub
2. Tạo **Web Service** trên [render.com](https://render.com)
3. Kết nối repo GitHub
4. Cấu hình:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Thêm environment variables (`VERIFY_TOKEN`, `PAGE_ACCESS_TOKEN`)
6. Deploy!

### Railway

1. Push code lên GitHub
2. Tạo project mới trên [railway.app](https://railway.app)
3. Kết nối repo → Railway tự detect Node.js
4. Thêm env variables trong Settings
5. Deploy tự động!

## 🔮 Mở rộng

Sau khi hoàn thành echo bot cơ bản, bạn có thể thêm:

- 📎 **Xử lý attachments** (hình ảnh, video, file)
- 🔘 **Quick Replies** & **Buttons** 
- 📋 **Generic Template** (carousel cards)
- 🤖 **Tích hợp AI** (ChatGPT, Gemini) để trả lời thông minh
- 💾 **Database** lưu lịch sử chat
- 👤 **Get User Profile** từ Graph API

## 📚 Tài liệu tham khảo

- [Messenger Platform Docs](https://developers.facebook.com/docs/messenger-platform)
- [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Send API Reference](https://developers.facebook.com/docs/messenger-platform/reference/send-api)
