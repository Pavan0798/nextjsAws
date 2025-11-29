-- Database schema for the posts table
-- Run this SQL in your PostgreSQL database to create the table

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Sample data (optional)
-- INSERT INTO posts (title, content) VALUES 
--   ('First Post', 'This is the content of the first post'),
--   ('Second Post', 'This is the content of the second post');
