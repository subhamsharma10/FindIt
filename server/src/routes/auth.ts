import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();
const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(100)
});
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

function tokenFor(user: any) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 24) throw new Error('Set JWT_SECRET to a random value of at least 24 characters.');
  return jwt.sign({ id: user._id.toString(), role: user.role, name: user.name, email: user.email }, secret, { expiresIn: '12h' });
}
function safeUser(user: any) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid registration details.' });
    const email = parsed.data.email.toLowerCase();
    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({ ...parsed.data, email, passwordHash, role: 'STUDENT' });
    return res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Enter a valid email and password.' });
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    return res.json({ token: tokenFor(user), user: safeUser(user) });
  } catch (e) { next(e); }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});
export default router;
