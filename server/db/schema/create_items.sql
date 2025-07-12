CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  type VARCHAR(100),
  size VARCHAR(50),
  `condition` ENUM('New', 'Like New', 'Good', 'Worn') DEFAULT 'Good',
  tags TEXT, -- optionally store comma-separated tags
  images TEXT, -- optionally store comma-separated URLs
  status ENUM('Available', 'Pending', 'Swapped') DEFAULT 'Available',
  approved BOOLEAN DEFAULT FALSE,
  uploader_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);
