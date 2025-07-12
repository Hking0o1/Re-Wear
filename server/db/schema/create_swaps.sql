CREATE TABLE IF NOT EXISTS swaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  requester_id INT,
  owner_id INT,
  method ENUM('direct', 'points') NOT NULL,
  status ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
