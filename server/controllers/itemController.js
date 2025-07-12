const { pool } = require('../config/database.js');
const { deleteFiles } = require('../middleware/upload.js');
const path = require('path');

// Get all items with filters and pagination
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category_id,
      size,
      condition_type,
      min_points,
      max_points,
      search,
      uploader_id,
      approval_status = 'approved'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build WHERE clause
    let whereConditions = ['ci.approval_status = ?'];
    let queryParams = [approval_status];

    if (category_id) {
      whereConditions.push('ci.category_id = ?');
      queryParams.push(category_id);
    }

    if (size) {
      whereConditions.push('ci.size = ?');
      queryParams.push(size);
    }

    if (condition_type) {
      whereConditions.push('ci.condition_type = ?');
      queryParams.push(condition_type);
    }

    if (min_points) {
      whereConditions.push('ci.point_value >= ?');
      queryParams.push(min_points);
    }

    if (max_points) {
      whereConditions.push('ci.point_value <= ?');
      queryParams.push(max_points);
    }

    if (uploader_id) {
      whereConditions.push('ci.uploader_id = ?');
      queryParams.push(uploader_id);
    }

    if (search) {
      whereConditions.push('(ci.title LIKE ? OR ci.description LIKE ? OR ci.type LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM clothing_items ci WHERE ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Get items with pagination
    const [items] = await pool.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        u.avatar as uploader_avatar,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT ii.image_url ORDER BY ii.is_primary DESC, ii.display_order) as images,
        GROUP_CONCAT(DISTINCT it.tag) as tags
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      LEFT JOIN item_images ii ON ci.id = ii.item_id
      LEFT JOIN item_tags it ON ci.id = it.item_id
      WHERE ${whereClause}
      GROUP BY ci.id
      ORDER BY ci.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Process items data
    const processedItems = items.map(item => ({
      ...item,
      images: item.images ? item.images.split(',') : [],
      tags: item.tags ? item.tags.split(',') : []
    }));

    res.json({
      success: true,
      data: {
        items: processedItems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items'
    });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [items] = await pool.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        u.avatar as uploader_avatar,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT ii.image_url ORDER BY ii.is_primary DESC, ii.display_order) as images,
        GROUP_CONCAT(DISTINCT it.tag) as tags
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      LEFT JOIN item_images ii ON ci.id = ii.item_id
      LEFT JOIN item_tags it ON ci.id = it.item_id
      WHERE ci.id = ?
      GROUP BY ci.id`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const item = {
      ...items[0],
      images: items[0].images ? items[0].images.split(',') : [],
      tags: items[0].tags ? items[0].tags.split(',') : []
    };

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item'
    });
  }
};

// Create new item
const createItem = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      title,
      description,
      category_id,
      type,
      size,
      condition_type,
      point_value,
      tags = []
    } = req.body;

    const uploader_id = req.user.id;

    // Create item
    const [itemResult] = await connection.execute(
      `INSERT INTO clothing_items 
       (title, description, category_id, type, size, condition_type, point_value, uploader_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category_id, type, size, condition_type, point_value, uploader_id]
    );

    const itemId = itemResult.insertId;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map((file, index) => [
        itemId,
        `/uploads/items/${file.filename}`,
        index === 0, // First image is primary
        index
      ]);

      await connection.execute(
        `INSERT INTO item_images (item_id, image_url, is_primary, display_order) VALUES ${
          imageInserts.map(() => '(?, ?, ?, ?)').join(', ')
        }`,
        imageInserts.flat()
      );
    }

    // Handle tags
    if (tags.length > 0) {
      const tagInserts = tags.map(tag => [itemId, tag.trim()]);
      await connection.execute(
        `INSERT INTO item_tags (item_id, tag) VALUES ${
          tagInserts.map(() => '(?, ?)').join(', ')
        }`,
        tagInserts.flat()
      );
    }

    await connection.commit();

    // Get the created item
    const [createdItems] = await connection.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT ii.image_url ORDER BY ii.is_primary DESC, ii.display_order) as images,
        GROUP_CONCAT(DISTINCT it.tag) as tags
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      LEFT JOIN item_images ii ON ci.id = ii.item_id
      LEFT JOIN item_tags it ON ci.id = it.item_id
      WHERE ci.id = ?
      GROUP BY ci.id`,
      [itemId]
    );

    const item = {
      ...createdItems[0],
      images: createdItems[0].images ? createdItems[0].images.split(',') : [],
      tags: createdItems[0].tags ? createdItems[0].tags.split(',') : []
    };

    res.status(201).json({
      success: true,
      message: 'Item created successfully and submitted for review',
      data: { item }
    });

  } catch (error) {
    await connection.rollback();
    
    // Delete uploaded files if item creation failed
    if (req.files) {
      const filePaths = req.files.map(file => file.path);
      deleteFiles(filePaths);
    }

    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  } finally {
    connection.release();
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Check if item exists and user has permission
    const [items] = await pool.execute(
      'SELECT uploader_id FROM clothing_items WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Only item owner or admin can update
    if (items[0].uploader_id !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    const updateFields = [];
    const updateValues = [];

    // Build dynamic update query
    const allowedFields = ['title', 'description', 'point_value', 'is_available'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(req.body[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE clothing_items SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    // Get updated item
    const [updatedItems] = await pool.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT ii.image_url ORDER BY ii.is_primary DESC, ii.display_order) as images,
        GROUP_CONCAT(DISTINCT it.tag) as tags
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      LEFT JOIN item_images ii ON ci.id = ii.item_id
      LEFT JOIN item_tags it ON ci.id = it.item_id
      WHERE ci.id = ?
      GROUP BY ci.id`,
      [id]
    );

    const item = {
      ...updatedItems[0],
      images: updatedItems[0].images ? updatedItems[0].images.split(',') : [],
      tags: updatedItems[0].tags ? updatedItems[0].tags.split(',') : []
    };

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Get item with images
    const [items] = await connection.execute(
      `SELECT ci.uploader_id, GROUP_CONCAT(ii.image_url) as images
       FROM clothing_items ci
       LEFT JOIN item_images ii ON ci.id = ii.item_id
       WHERE ci.id = ?
       GROUP BY ci.id`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Only item owner or admin can delete
    if (items[0].uploader_id !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await connection.beginTransaction();

    // Delete item (cascading deletes will handle related records)
    await connection.execute('DELETE FROM clothing_items WHERE id = ?', [id]);

    await connection.commit();

    // Delete image files
    if (items[0].images) {
      const imagePaths = items[0].images.split(',').map(url => 
        path.join(process.cwd(), url.replace('/uploads/', 'uploads/'))
      );
      deleteFiles(imagePaths);
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  } finally {
    connection.release();
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE is_active = TRUE ORDER BY name'
    );

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories
};