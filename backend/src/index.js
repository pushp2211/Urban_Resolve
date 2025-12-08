import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

import { deleteOldReadNotifications } from './services/notification.service.js';
import { scheduleCleanup } from './services/notification.service.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is listening at port ${process.env.PORT}`);
    });
    app.on('error', (error) => {
      console.log('app listening error', error);
      throw error;
    });
    deleteOldReadNotifications();
    scheduleCleanup();
  })
  .catch((err) => {
    console.log('DB connection error', err);
  });
