const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT i.*, u.name as uploader_name, u.email as uploader_email
      FROM items i
      JOIN users u ON i.uploader_id = u.id
      WHERE i.id = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: 'Item not found' });

    const item = rows[0];
    item.images = JSON.parse(item.images);  // convert from JSON string
    item.tags = JSON.parse(item.tags);

    item.uploader = {
      name: item.uploader_name,
      email: item.uploader_email
    };

    delete item.uploader_name;
    delete item.uploader_email;

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.get('/category/:category', async (req, res) => {
  const category = req.params.category;
  try {
    const [rows] = await db.query(`
      SELECT id, title, images
      FROM items
      WHERE category = ?
      ORDER BY id DESC
      LIMIT 10
    `, [category]);

    const items = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images)
    }));

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch related items' });
  }
});


module.exports = router;