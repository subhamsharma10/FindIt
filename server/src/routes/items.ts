import { Router } from 'express';
import { z } from 'zod';
import Item from '../models/Item';
import Claim from '../models/Claim';
import { AuthRequest, requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const itemSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  type: z.enum(['LOST', 'FOUND']),
  category: z.enum(['Electronics', 'ID & Cards', 'Bags', 'Keys', 'Clothing', 'Books', 'Accessories', 'Other']),
  location: z.string().trim().min(2).max(160),
  dateOccurred: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal('')),
  contactHint: z.string().max(160).optional()
});

router.get('/', async (req, res, next) => {
  try {
    const filter: any = { status: { $ne: 'ARCHIVED' } };
    if (req.query.type === 'LOST' || req.query.type === 'FOUND') filter.type = req.query.type;
    if (typeof req.query.category === 'string' && req.query.category !== 'All') filter.category = req.query.category;
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const q = req.query.q.trim().slice(0, 100);
      filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { location: { $regex: q, $options: 'i' } }];
    }
    const items = await Item.find(filter).sort({ createdAt: -1 }).limit(100).populate('owner', 'name');
    res.json({ items });
  } catch (e) { next(e); }
});

router.get('/mine', requireAuth, async (req: AuthRequest, res, next) => {
  try { const items = await Item.find({ owner: req.user!.id }).sort({ createdAt: -1 }); res.json({ items }); }
  catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name');
    if (!item || item.status === 'ARCHIVED') return res.status(404).json({ message: 'Item not found.' });
    res.json({ item });
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid item details.' });
    const item = await Item.create({ ...parsed.data, dateOccurred: new Date(parsed.data.dateOccurred), owner: req.user!.id });
    res.status(201).json({ item });
  } catch (e) { next(e); }
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const status = z.enum(['OPEN', 'CLAIM_PENDING', 'RESOLVED', 'ARCHIVED']).safeParse(req.body.status);
    if (!status.success) return res.status(400).json({ message: 'Invalid item status.' });
    const item = await Item.findByIdAndUpdate(req.params.id, { status: status.data }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ item });
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    if (item.owner.toString() !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'You can only remove your own reports.' });
    item.status = 'ARCHIVED'; await item.save();
    res.json({ message: 'Report archived.' });
  } catch (e) { next(e); }
});
export default router;
