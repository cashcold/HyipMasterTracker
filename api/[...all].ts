import handler, { app } from './index.ts';

/**
 * Catch-all Vercel Serverless Function Route
 * Ensures all /api/* requests (e.g. /api/projects/:slug, /api/auth/login) are caught
 * seamlessly in Vercel deployments even without custom rewrites.
 */
export default handler;
export { app };
