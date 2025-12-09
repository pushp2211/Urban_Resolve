import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import staffRouter from './routes/staff.complaint.route.js';
import complaintRouter from './routes/complaint.routes.js';
import adminRouter from './routes/admin.routes.js';
import serviceRouter from './routes/service.routes.js';
import reportRouter from './routes/report.routes.js';
import { verifyJWT } from './middlewares/auth.middleware.js';
import notificationRouter from './routes/notification.routes.js';
import verificationRouter from './routes/verifyEmail.routes.js';

import landingRouter from './routes/landing.routes.js';
import { apiError } from './utils/apiError.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '16kb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

app.use(express.static('public'));

app.use(cookieParser());

//routes import

//routes declaration
app.use('/api/v1/', userRouter); //middleware use kr rhe get nhi krr rhe kyunki ab hum router use kr rhe hain jo
app.use('/api/v1/staff/complaints', staffRouter);
app.use('/api/v1/complaint/', complaintRouter);

//admin routes
app.use('/api/v1/admin/', adminRouter);

//servics routes
app.use('/api/v1/service/', serviceRouter);

//notification routes
app.use('/api/v1/user/notification', notificationRouter);

//verify email router
app.use('/api/v1/user/verify/', verificationRouter);

//report router
app.use('/api/v1/data/', reportRouter);

//landing page router
app.use('/api/v1/landing/', landingRouter);

app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err);

  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});
export { app };
