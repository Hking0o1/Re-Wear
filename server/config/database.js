const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); 

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'rewear_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

};

// Create connection pool
const pool = mysql.createPool(dbConfig).promise();

// Test database connection
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

// Initialize database and tables
const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();

    // Test connection with the database
    await testConnection();

    // Create tables
    await createTables();
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        points INT DEFAULT 100,
        avatar VARCHAR(500),
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_points (points)
      )
    `);

    // Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clothing items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clothing_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category_id INT,
        type VARCHAR(100) NOT NULL,
        size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
        condition_type ENUM('Like New', 'Good', 'Fair', 'Well-Worn') NOT NULL,
        point_value INT NOT NULL DEFAULT 100,
        uploader_id INT NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_uploader (uploader_id),
        INDEX idx_category (category_id),
        INDEX idx_status (approval_status),
        INDEX idx_available (is_available),
        INDEX idx_points (point_value)
      )
    `);

    // Item images table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS item_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        item_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
        INDEX idx_item (item_id),
        INDEX idx_primary (is_primary)
      )
    `);

    // Item tags table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS item_tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        item_id INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
        INDEX idx_item (item_id),
        INDEX idx_tag (tag),
        UNIQUE KEY unique_item_tag (item_id, tag)
      )
    `);

    // Swap requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS swap_requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        requester_id INT NOT NULL,
        item_id INT NOT NULL,
        offered_item_id INT,
        message TEXT,
        status ENUM('pending', 'accepted', 'declined', 'completed', 'cancelled') DEFAULT 'pending',
        response_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
        FOREIGN KEY (offered_item_id) REFERENCES clothing_items(id) ON DELETE SET NULL,
        INDEX idx_requester (requester_id),
        INDEX idx_item (item_id),
        INDEX idx_status (status)
      )
    `);

    // Point transactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS point_transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        item_id INT,
        transaction_type ENUM('earned', 'spent', 'bonus', 'penalty') NOT NULL,
        points INT NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES clothing_items(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_type (transaction_type)
      )
    `);

    // User favorites table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        item_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_item (user_id, item_id),
        INDEX idx_user (user_id),
        INDEX idx_item (item_id)
      )
    `);

    // Insert default categories
    await connection.execute(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('Outerwear', 'Jackets, coats, and outer garments'),
      ('Tops', 'T-shirts, blouses, and upper body clothing'),
      ('Bottoms', 'Pants, jeans, shorts, and skirts'),
      ('Dresses', 'Dresses and one-piece garments'),
      ('Shoes', 'Footwear of all types'),
      ('Accessories', 'Bags, jewelry, and fashion accessories')
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};