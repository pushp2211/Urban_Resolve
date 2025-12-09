import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 13, // max 20 req per IP per 10 sec
});

export default rateLimiter;