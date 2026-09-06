import express, { type Express } from 'express';
import cors from 'cors';
import apiRouter from './routes/api.ts';
import { store } from './db/store.ts';

export function createApp(): Express {
  const app = express();

  // 1. Enable CORS for all incoming origins and headers
  app.use(
    cors({
      origin: true, // Dynamically reflects request origin (works with fetch/credentials)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  // 2. Explicitly handle preflight OPTIONS requests for all routes
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.sendStatus(200);
    }
    next();
  });

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root API info and health endpoints
  app.get(['/api', '/api/', '/api/health', '/health'], (req, res) => {
    res.json({
      status: 'ok',
      service: 'HyipMasterTracker API',
      runtime: process.env.VERCEL ? 'Vercel Serverless Function' : 'Node.js Standalone',
      timestamp: new Date().toISOString(),
      projectsCount: store.projects.length,
      monitorsCount: store.monitors.length,
      reviewsCount: store.reviews.length,
      endpoints: {
        health: '/api/health',
        projects: '/api/projects',
        reviews: '/api/reviews',
        events: '/api/events',
        monitors: '/api/monitors',
        statistics: '/api/statistics',
        cryptoRates: '/api/crypto/rates',
        cryptoPayments: '/api/crypto/payments',
      },
    });
  });

  // Mount API router under /api
  app.use('/api', apiRouter);

  return app;
}

export const app = createApp();
export default app;
