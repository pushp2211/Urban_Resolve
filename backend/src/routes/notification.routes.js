import express from 'express';
import {
  getNotificationsForUser,
  markNotificationAsRead,
} from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', getNotificationsForUser);

router.patch('/:id/markread', markNotificationAsRead);

export default router;
