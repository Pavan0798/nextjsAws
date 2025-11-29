const db = require('../../lib/db');

export default async function handler(req, res) {
    // Initialize schema on first request (creates table if not exists)
    try {
        await db.initializeSchema();
    } catch (error) {
        console.error('Schema initialization error:', error);
        // Continue anyway - table might already exist
    }

    if (req.method === 'GET') {
        // Get all posts
        try {
            const result = await db.query(
                'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC'
            );

            return res.status(200).json({
                success: true,
                data: result.rows,
                count: result.rowCount,
            });
        } catch (error) {
            console.error('GET /api/posts error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch posts',
                message: error.message,
            });
        }
    } else if (req.method === 'POST') {
        // Create a new post
        try {
            const { title, content } = req.body;

            // Validation
            if (!title || title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Title is required',
                });
            }

            // Insert into database
            const result = await db.query(
                'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at',
                [title.trim(), content || '']
            );

            return res.status(201).json({
                success: true,
                data: result.rows[0],
                message: 'Post created successfully',
            });
        } catch (error) {
            console.error('POST /api/posts error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create post',
                message: error.message,
            });
        }
    } else {
        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            success: false,
            error: `Method ${req.method} not allowed`,
        });
    }
}
