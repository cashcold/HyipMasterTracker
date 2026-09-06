import serverless from 'serverless-http';
import app from '../../server/app.ts';

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  // Normalize Netlify event path so it maps correctly to Express /api router
  if (event.path) {
    if (event.path.startsWith('/.netlify/functions/api')) {
      event.path = event.path.replace('/.netlify/functions/api', '/api');
    } else if (!event.path.startsWith('/api')) {
      event.path = `/api${event.path.startsWith('/') ? '' : '/'}${event.path}`;
    }
  }

  return await serverlessHandler(event, context);
};

export default handler;
