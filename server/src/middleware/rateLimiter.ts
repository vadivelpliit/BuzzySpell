import rateLimit from 'express-rate-limit';

// Rate limiter for content generation endpoints
export const contentGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many content generation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
