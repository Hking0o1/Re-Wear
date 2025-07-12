const { pool } = require('../config/database.js');

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM clothing_items WHERE approval_status = 'pending') as pending_items,
        (SELECT COUNT(*) FROM clothing_items WHERE approval_status = 'approved') as approved_items,
        (SELECT COUNT(*) FROM clothing_items WHERE approval_status = 'rejected') as rejected_items,
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as active_users,
        (SELECT COUNT(*) FROM swap_requests WHERE status = 'completed') as completed_swaps,
        (SELECT COUNT(*) FROM swap_requests WHERE status = 'pending') as pending_swaps
    `);

    res.json({
      success: true,
      data: { stats: stats[0] }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};

// Get items for moderation
const getItemsForModeration = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      approval_status = 'pending' 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM clothing_items WHERE approval_status = ?',
      [approval_status]
    );

    const total = countResult[0].total;

    // Get items
    const [items] = await pool.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        u.email as uploader_email,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT ii.image_url ORDER BY ii.is_primary DESC, ii.display_order) as images,
        GROUP_CONCAT(DISTINCT it.tag) as tags
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      LEFT JOIN item_images ii ON ci.id = ii.item_id
      LEFT JOIN item_tags it ON ci.id = it.item_id
      WHERE ci.approval_status = ?
      GROUP BY ci.id
      ORDER BY ci.created_at ASC
      LIMIT ? OFFSET ?`,
      [approval_status, parseInt(limit), offset]
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
    console.error('Get items for moderation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items for moderation'
    });
  }
};

// Moderate item (approve/reject)
const moderateItem = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    const { approval_status, rejection_reason, point_value } = req.body;

    // Get item details
    const [items] = await connection.execute(
      'SELECT uploader_id, title, approval_status as current_status FROM clothing_items WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const item = items[0];

    if (item.current_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Item has already been moderated'
      });
    }

    await connection.beginTransaction();

    // Update item status
    const updateFields = ['approval_status = ?'];
    const updateValues = [approval_status];

    if (rejection_reason) {
      updateFields.push('rejection_reason = ?');
      updateValues.push(rejection_reason);
    }

    if (point_value && approval_status === 'approved') {
      updateFields.push('point_value = ?');
      updateValues.push(point_value);
    }

    updateValues.push(id);

    await connection.execute(
      `UPDATE clothing_items SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    if (approval_status === 'approved') {
      // Award points to uploader for approved item
      const pointsAwarded = 50; // Base points for approved listing
      
      await connection.execute(
        'UPDATE users SET points = points + ? WHERE id = ?',
        [pointsAwarded, item.uploader_id]
      );

      // Record point transaction
      await connection.execute(
        'INSERT INTO point_transactions (user_id, item_id, transaction_type, points, description) VALUES (?, ?, ?, ?, ?)',
        [item.uploader_id, id, 'earned', pointsAwarded, `Points earned for approved listing: ${item.title}`]
      );
    }

    await connection.commit();

    // Get updated item
    const [updatedItems] = await connection.execute(
      `SELECT 
        ci.*,
        u.name as uploader_name,
        c.name as category_name
      FROM clothing_items ci
      JOIN users u ON ci.uploader_id = u.id
      LEFT JOIN categories c ON ci.category_id = c.id
      WHERE ci.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: `Item ${approval_status} successfully`,
      data: { item: updatedItems[0] }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Moderate item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate item'
    });
  } finally {
    connection.release();
  }
};

// Get all users for admin management
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      is_active 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(u.name LIKE ? OR u.email LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    if (is_active !== undefined) {
      whereConditions.push('u.is_active = ?');
      queryParams.push(is_active === 'true');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Get users with stats
    const [users] = await pool.execute(
      `SELECT 
        u.*,
        COUNT(DISTINCT ci.id) as total_items,
        COUNT(DISTINCT sr.id) as total_swaps,
        COALESCE(SUM(pt.points), 0) as total_points_earned
      FROM users u
      LEFT JOIN clothing_items ci ON u.id = ci.uploader_id AND ci.approval_status = 'approved'
      LEFT JOIN swap_requests sr ON u.id = sr.requester_id AND sr.status = 'completed'
      LEFT JOIN point_transactions pt ON u.id = pt.user_id AND pt.transaction_type = 'earned'
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: {
        users: sanitizedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.id && !is_active) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    await pool.execute(
      'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_active, id]
    );

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// Get platform analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const [analytics] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN approval_status = 'approved' THEN 1 END) as new_items,
        COUNT(CASE WHEN approval_status = 'pending' THEN 1 END) as pending_items
      FROM clothing_items 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [parseInt(period)]);

    const [userGrowth] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [parseInt(period)]);

    const [swapActivity] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_swaps,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_swaps
      FROM swap_requests 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [parseInt(period)]);

    res.json({
      success: true,
      data: {
        itemActivity: analytics,
        userGrowth,
        swapActivity
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
};

module.exports = {
  getDashboardStats,
  getItemsForModeration,
  moderateItem,
  getUsers,
  toggleUserStatus,
  getAnalytics
};