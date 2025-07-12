-- schema/create_items.sql

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  type TEXT,
  size TEXT,
  condition VARCHAR(20) CHECK (condition IN ('New', 'Like New', 'Good', 'Worn')),
  tags TEXT[],
  images TEXT[],
  status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Pending', 'Swapped')),
  approved BOOLEAN DEFAULT FALSE,
  uploader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
