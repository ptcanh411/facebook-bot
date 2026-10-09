import { Router } from 'express';
import { verifyWebhook, handleIncomingMessage } from '../controllers/messengerController.js';

const router = Router();

// GET /webhook - Facebook gửi để verify webhook
router.get('/', verifyWebhook);

// POST /webhook - Facebook gửi khi có tin nhắn mới
router.post('/', handleIncomingMessage);

export default router;
