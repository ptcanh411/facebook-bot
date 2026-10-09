# AGENTS.md - Facebook Messenger Echo Bot

## Tổng quan dự án

Đây là một **Facebook Messenger Chat Bot** đơn giản, sử dụng Node.js + Express. Bot hoạt động theo mô hình **echo bot** — nhận tin nhắn từ người dùng và gửi lại chính nội dung đó.

## Kiến trúc

```
facebook-chat-bot/
├── src/
│   ├── index.js          # Entry point - khởi tạo Express server
│   ├── routes/
│   │   └── webhook.js    # Xử lý GET (verify) & POST (nhận message) webhook
│   ├── controllers/
│   │   └── messengerController.js  # Xử lý logic tin nhắn
│   └── services/
│       └── messengerService.js     # Gọi Facebook Graph API gửi tin nhắn
├── test/
│   └── mock-webhook.js   # Script test webhook locally
├── .env                  # Biến môi trường (KHÔNG commit)
├── .env.example          # Mẫu biến môi trường
├── .gitignore
├── package.json
├── AGENTS.md             # File này
└── README.md
```

## Tech stack

| Thành phần    | Công nghệ                                  |
|---------------|---------------------------------------------|
| Runtime       | Node.js v24+                                |
| Framework     | Express 4.x                                 |
| API           | Facebook Graph API v21.0 (Messenger)        |
| Env Config    | dotenv                                      |

## Quy ước code

### Ngôn ngữ & Style
- **JavaScript (ES Module)**: Sử dụng `import/export` (không dùng `require`).
- **Async/Await**: Ưu tiên async/await thay vì callback hay `.then()`.
- **Naming**: camelCase cho biến/hàm, PascalCase cho class, UPPER_SNAKE_CASE cho hằng số.
- **Comment**: Viết comment bằng tiếng Việt hoặc tiếng Anh đều được. Ưu tiên giải thích _tại sao_, không phải _cái gì_.

### Cấu trúc thư mục
- `src/routes/` — Định nghĩa Express router, chỉ chứa routing logic.
- `src/controllers/` — Xử lý business logic từ request.
- `src/services/` — Tương tác với bên ngoài (Facebook Graph API, database...).
- `test/` — Script test thủ công hoặc unit test.

### Biến môi trường (.env)
```env
PORT=3000
VERIFY_TOKEN=your_verify_token_here
PAGE_ACCESS_TOKEN=your_page_access_token_here
```

- **VERIFY_TOKEN**: Token tự đặt, dùng để Facebook xác minh webhook.
- **PAGE_ACCESS_TOKEN**: Token của Facebook Page, lấy từ Facebook Developer Console.
- **KHÔNG BAO GIỜ** commit file `.env` lên git.

## Cách hoạt động

### 1. Webhook Verification (GET /webhook)
Facebook gửi GET request với `hub.mode`, `hub.verify_token`, `hub.challenge`.
Bot kiểm tra `verify_token` khớp → trả về `hub.challenge` để xác nhận.

### 2. Nhận tin nhắn (POST /webhook)
Facebook gửi POST request chứa **message payload**:
```json
{
  "object": "page",
  "entry": [{
    "messaging": [{
      "sender": { "id": "USER_PSID" },
      "recipient": { "id": "PAGE_ID" },
      "timestamp": 1234567890,
      "message": {
        "mid": "message_id",
        "text": "Xin chào!"
      }
    }]
  }]
}
```

### 3. Gửi tin nhắn lại (Graph API)
Bot gọi `POST https://graph.facebook.com/v21.0/me/messages` với body:
```json
{
  "recipient": { "id": "USER_PSID" },
  "message": { "text": "Bạn vừa nói: Xin chào!" }
}
```

## Hướng dẫn cho AI Agent

### Khi thêm tính năng mới
1. Tạo handler trong `controllers/` nếu cần xử lý logic phức tạp.
2. Tạo service trong `services/` nếu cần gọi API bên ngoài.
3. Đăng ký route trong `routes/webhook.js`.
4. Cập nhật file `.env.example` nếu cần thêm biến môi trường mới.

### Khi debug
- Kiểm tra log từ `console.log` trong server.
- Dùng script `test/mock-webhook.js` để giả lập Facebook gửi webhook.
- Kiểm tra response status phải luôn trả `200 OK` cho POST webhook (nếu không Facebook sẽ retry).

### Lưu ý quan trọng
- **Luôn trả 200** cho POST `/webhook` ngay lập tức, xử lý message bất đồng bộ.
- **Không throw error** trong webhook handler — catch tất cả lỗi và log ra.
- Facebook yêu cầu HTTPS — khi dev local dùng **ngrok** hoặc tương tự để tạo tunnel.
- Rate limit Graph API: ~200 calls/hour/user. Tránh gửi quá nhiều tin nhắn liên tục.

## Lệnh thường dùng

```bash
# Cài dependencies
npm install

# Chạy server (dev mode, auto-reload)
npm run dev

# Chạy server (production)
npm start

# Test webhook giả lập
npm run test:webhook
```

## Tài liệu tham khảo

- [Facebook Messenger Platform Docs](https://developers.facebook.com/docs/messenger-platform)
- [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Send API Reference](https://developers.facebook.com/docs/messenger-platform/reference/send-api)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
