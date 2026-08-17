import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../db/store.ts';
import { IUser, UserRole } from '../types.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'hyip_master_tracker_jwt_secure_super_secret_key_2026';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };

    const user = store.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'User account has been suspended by administration' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = store.users.find((u) => u.id === decoded.id);
      if (user && !user.isSuspended) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore optional auth error
  }
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: Insufficient administrative privileges' });
    }

    next();
  };
}

export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);
export const requireModerator = requireRole(['MODERATOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']);
