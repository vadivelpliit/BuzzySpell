import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './database/db'; // loads DB and runs migrations before any routes
import { generalLimiter } from './middleware/rateLimiter';
import contentRoutes from './routes/content.routes';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Trust first proxy (Railway, Vercel, etc.) so X-Forwarded-For is used for rate limiting
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(generalLimiter);

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);

// API base (so GET /api returns something instead of 404)
app.get('/api', (req, res) => {
  res.json({
    ok: true,
    message: 'Buzzyspell API',
    endpoints: { user: '/api/user', content: '/api/content' },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🐝 Spelling Bee Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
});
