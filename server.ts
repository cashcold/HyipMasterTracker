import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/routes/api.ts';
import { store } from './server/db/store.ts';

async function startServer() {
  const app = express();
  
  // Use environment port for production hosting (Heroku, Render, etc.) or default to 3000
  const PORT = process.env.PORT || 3000;

  // Global CORS options
  const corsOptions = {
    origin: '*', // Adjust to your Netlify/Vercel domain in production if preferred
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Ensures compatibility with legacy browsers/clients
  };

  // Enable CORS middleware & preflight OPTIONS handling
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'HyipMasterTracker API',
      timestamp: new Date().toISOString(),
      projectsCount: store.projects.length,
    });
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HyipMasterTracker] Server active on port ${PORT}`);
  });
}

startServer();