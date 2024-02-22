import express from 'express';
const chatRouter = express.Router();

import { protect } from '../middleware/authMiddleware.js';
import { photoUpload } from '../middleware/multerMiddleware.js';
import { createChat, findChat, userChats } from '../controllers/ChatController.js';




chatRouter.post('/',createChat);
chatRouter.get('/:memberId',userChats)

chatRouter.get('/find/:firstId/:secondId', findChat)

export default chatRouter;