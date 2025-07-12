const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/items/featured
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, description, images, status
      FROM items
      WHERE approved = true AND status = 'Available'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
