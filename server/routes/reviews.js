const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// List reviews for a product
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ ok: false, message: 'Missing productId' });
    const docs = await Review.find({ productId, approved: true }).sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, data: docs });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Create review
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body || {};
    if (!productId || !rating) return res.status(400).json({ ok: false, message: 'Missing fields' });
    const doc = await Review.create({ productId, userId: req.user._id, rating: Number(rating), comment });
    return res.json({ ok: true, data: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Admin: approve/unapprove
router.put('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body || {};
    const doc = await Review.findByIdAndUpdate(id, { approved: !!approved }, { new: true }).lean();
    if (!doc) return res.status(404).json({ ok: false, message: 'Not found' });
    return res.json({ ok: true, data: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Admin: delete review
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;
