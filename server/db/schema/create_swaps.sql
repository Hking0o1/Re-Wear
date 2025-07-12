CREATE TABLE IF NOT EXISTS swaps (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  method VARCHAR(10) CHECK (method IN ('direct', 'points')),
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);