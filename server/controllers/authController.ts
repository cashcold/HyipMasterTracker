import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest, generateToken } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IUser } from '../types.ts';

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (!store.settings.allowUserRegistrations) {
      return res.status(403).json({ error: 'User registration is currently disabled by administrator' });
    }

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    const existingEmail = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    const existingUsername = store.users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: IUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: 'USER',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      isVerified: true,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(newUser);

    // Audit log
    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: newUser.id,
      userEmail: newUser.email,
      action: 'USER_REGISTERED',
      entity: 'USER',
      entityId: newUser.id,
      createdAt: new Date().toISOString(),
    });

    store.persist();

    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const identifier = emailOrUsername.trim().toLowerCase();
    const user = store.users.find(
      (u) => u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Account suspended. Contact administration.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { passwordHash: _, ...safeUser } = req.user;
  const watchlistCount = store.watchlists.filter((w) => w.userId === req.user!.id).length;
  const unreadNotifs = store.notifications.filter((n) => n.userId === req.user!.id && !n.isRead).length;
  const reviewCount = store.reviews.filter((r) => r.userId === req.user!.id).length;

  return res.json({
    user: {
      ...safeUser,
      watchlistCount,
      unreadNotifs,
      reviewCount,
    },
  });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, avatar } = req.body;
  const user = store.users.find((u) => u.id === req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name.trim();
  if (avatar) user.avatar = avatar.trim();
  user.updatedAt = new Date().toISOString();

  store.persist();
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ message: 'Profile updated', user: safeUser });
}
