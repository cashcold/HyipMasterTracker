import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/app.ts';

/**
 * Vercel Serverless Function Entry Point for HyipMasterTracker API
 * Handles all incoming API requests (e.g. /api/projects, /api/health, /api/statistics, /api/reviews, etc.)
 */
export default function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  // Normalize request URL if it was stripped or rewritten without /api prefix
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return (app as any)(req, res);
}

export { app };
