const{ pool } = require('../config/database.js');

// Create swap request
const createSwapRequest = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { item_id, offered_item_id, message } = req.body;
    const requester_id = req.user.id;

    // Check if item exists and is available
    const [items] = await connection.execute(
      'SELECT uploader_id, is_available, approval_status FROM clothing_items WHERE id = ?',
      [item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const item = items[0];

    if (!item.is_available) {
      return res.status(400).json({
        success: false,
        message: 'Item is not available for swap'
      });
    }

    if (item.approval_status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Item is not approved for swapping'
      });
    }

    if (item.uploader_id === requester_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request swap for your own item'
      });
    }

    // Check if offered item exists and belongs to requester (if provided)
    if (offered_item_id) {
      const [offeredItems] = await connection.execute(
        'SELECT uploader_id, is_available, approval_status FROM clothing_items WHERE id = ?',
        [offered_item_id]
      );

      if (offeredItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Offered item not found'
        });
      }

      const offeredItem = offeredItems[0];

      if (offeredItem.uploader_id !== requester_id) {
        return res.status(403).json({
          success: false,
          message: 'You can only offer your own items'
        });
      }

      if (!offeredItem.is_available || offeredItem.approval_status !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Offered item is not available for swap'
        });
      }
    }

    // Check for existing pending request
    const [existingRequests] = await connection.execute(
      'SELECT id FROM swap_requests WHERE requester_id = ? AND item_id = ? AND status = "pending"',
      [requester_id, item_id]
    );

    if (existingRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this item'
      });
    }

    await connection.beginTransaction();

    // Create swap request
    const [result] = await connection.execute(
      'INSERT INTO swap_requests (requester_id, item_id, offered_item_id, message) VALUES (?, ?, ?, ?)',
      [requester_id, item_id, offered_item_id, message]
    );

    await connection.commit();

    // Get created swap request with details
    const [swapRequests] = await connection.execute(
      `SELECT 
        sr.*,
        u.name as requester_name,
        ci.title as item_title,
        oci.title as offered_item_title
      FROM swap_requests sr
      JOIN users u ON sr.requester_id = u.id
      JOIN clothing_items ci ON sr.item_id = ci.id
      LEFT JOIN clothing_items oci ON sr.offered_item_id = oci.id
      WHERE sr.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: { swapRequest: swapRequests[0] }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create swap request'
    });
  } finally {
    connection.release();
  }
};

// Get swap requests (for item owner)
const getSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type = 'received' } = req.query;

    let query;
    let queryParams = [userId];

    if (type === 'sent') {
      // Requests sent by the user
      query = `
        SELECT 
          sr.*,
          ci.title as item_title,
          ci.uploader_id as item_owner_id,
          u.name as item_owner_name,
          oci.title as offered_item_title
        FROM swap_requests sr
        JOIN clothing_items ci ON sr.item_id = ci.id
        JOIN users u ON ci.uploader_id = u.id
        LEFT JOIN clothing_items oci ON sr.offered_item_id = oci.id
        WHERE sr.requester_id = ?
      `;
    } else {
      // Requests received by the user (for their items)
      query = `
        SELECT 
          sr.*,
          u.name as requester_name,
          ci.title as item_title,
          oci.title as offered_item_title
        FROM swap_requests sr
        JOIN users u ON sr.requester_id = u.id
        JOIN clothing_items ci ON sr.item_id = ci.id
        LEFT JOIN clothing_items oci ON sr.offered_item_id = oci.id
        WHERE ci.uploader_id = ?
      `;
    }

    if (status) {
      query += ' AND sr.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY sr.created_at DESC';

    const [swapRequests] = await pool.execute(query, queryParams);

    res.json({
      success: true,
      data: { swapRequests }
    });

  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get swap requests'
    });
  }
};

// Respond to swap request
const respondToSwapRequest = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    const { status, response_message } = req.body;
    const userId = req.user.id;

    // Get swap request details
    const [swapRequests] = await connection.execute(
      `SELECT 
        sr.*,
        ci.uploader_id,
        ci.point_value,
        ci.title as item_title,
        u.name as requester_name
      FROM swap_requests sr
      JOIN clothing_items ci ON sr.item_id = ci.id
      JOIN users u ON sr.requester_id = u.id
      WHERE sr.id = ?`,
      [id]
    );

    if (swapRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    const swapRequest = swapRequests[0];

    // Check if user is the item owner
    if (swapRequest.uploader_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been responded to'
      });
    }

    await connection.beginTransaction();

    // Update swap request
    await connection.execute(
      'UPDATE swap_requests SET status = ?, response_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, response_message, id]
    );

    if (status === 'accepted') {
      // Mark item as unavailable
      await connection.execute(
        'UPDATE clothing_items SET is_available = FALSE WHERE id = ?',
        [swapRequest.item_id]
      );

      // If there's an offered item, mark it as unavailable too
      if (swapRequest.offered_item_id) {
        await connection.execute(
          'UPDATE clothing_items SET is_available = FALSE WHERE id = ?',
          [swapRequest.offered_item_id]
        );
      }

      // Award points to the requester
      const pointsAwarded = Math.floor(swapRequest.point_value * 0.5); // 50% of item value
      
      await connection.execute(
        'UPDATE users SET points = points + ? WHERE id = ?',
        [pointsAwarded, swapRequest.requester_id]
      );

      // Record point transaction
      await connection.execute(
        'INSERT INTO point_transactions (user_id, item_id, transaction_type, points, description) VALUES (?, ?, ?, ?, ?)',
        [swapRequest.requester_id, swapRequest.item_id, 'earned', pointsAwarded, `Points earned from successful swap: ${swapRequest.item_title}`]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Swap request ${status} successfully`,
      data: { swapRequest: { ...swapRequest, status, response_message } }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Respond to swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to swap request'
    });
  } finally {
    connection.release();
  }
};

// Redeem item with points
const redeemWithPoints = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { item_id } = req.body;
    const userId = req.user.id;

    // Get item and user details
    const [items] = await connection.execute(
      'SELECT uploader_id, point_value, is_available, approval_status, title FROM clothing_items WHERE id = ?',
      [item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const item = items[0];

    if (!item.is_available) {
      return res.status(400).json({
        success: false,
        message: 'Item is not available'
      });
    }

    if (item.approval_status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Item is not approved'
      });
    }

    if (item.uploader_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot redeem your own item'
      });
    }

    // Check user points
    const [users] = await connection.execute(
      'SELECT points FROM users WHERE id = ?',
      [userId]
    );

    if (users[0].points < item.point_value) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${item.point_value} points but have ${users[0].points}`
      });
    }

    await connection.beginTransaction();

    // Deduct points from user
    await connection.execute(
      'UPDATE users SET points = points - ? WHERE id = ?',
      [item.point_value, userId]
    );

    // Award points to item owner
    const ownerPoints = Math.floor(item.point_value * 0.8); // 80% to owner
    await connection.execute(
      'UPDATE users SET points = points + ? WHERE id = ?',
      [ownerPoints, item.uploader_id]
    );

    // Mark item as unavailable
    await connection.execute(
      'UPDATE clothing_items SET is_available = FALSE WHERE id = ?',
      [item_id]
    );

    // Record transactions
    await connection.execute(
      'INSERT INTO point_transactions (user_id, item_id, transaction_type, points, description) VALUES (?, ?, ?, ?, ?)',
      [userId, item_id, 'spent', -item.point_value, `Points spent on: ${item.title}`]
    );

    await connection.execute(
      'INSERT INTO point_transactions (user_id, item_id, transaction_type, points, description) VALUES (?, ?, ?, ?, ?)',
      [item.uploader_id, item_id, 'earned', ownerPoints, `Points earned from sale: ${item.title}`]
    );

    // Create a completed swap record
    await connection.execute(
      'INSERT INTO swap_requests (requester_id, item_id, message, status) VALUES (?, ?, ?, ?)',
      [userId, item_id, 'Redeemed with points', 'completed']
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Item redeemed successfully with points',
      data: {
        pointsSpent: item.point_value,
        remainingPoints: users[0].points - item.point_value
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Redeem with points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to redeem item'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
  redeemWithPoints
};