import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  // Database operations state
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posts, setPosts] = useState([])
  const [dbLoading, setDbLoading] = useState(false)
  const [dbMessage, setDbMessage] = useState(null)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }

  async function callApi(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setResponse({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function createPost(e) {
    e.preventDefault()
    setDbLoading(true)
    setDbMessage(null)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
      })
      const data = await res.json()

      if (data.success) {
        setDbMessage({ type: 'success', text: 'Post created successfully!' })
        setPostTitle('')
        setPostContent('')
        fetchPosts() // Refresh posts list
      } else {
        setDbMessage({ type: 'error', text: data.error || 'Failed to create post' })
      }
    } catch (err) {
      setDbMessage({ type: 'error', text: err.message })
    } finally {
      setDbLoading(false)
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, Roboto, sans-serif', padding: 24, maxWidth: 1200 }}>
      <h1>Next.js Fullstack — React UI + API + PostgreSQL</h1>

      {/* Original Echo API Section */}
      <section style={{ marginBottom: 40, padding: 20, background: '#f6f8fa', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Echo API Test</h2>
        <p>Type a message and send it to the backend:</p>

        <form onSubmit={callApi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hello from frontend"
            style={{ padding: 8, minWidth: 300 }}
          />
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
          <strong>Response:</strong>
          <pre style={{ background: '#fff', padding: 12, borderRadius: 6, border: '1px solid #ddd' }}>
            {response ? JSON.stringify(response, null, 2) : 'No response yet.'}
          </pre>
        </div>
      </section>

      {/* Database Operations Section */}
      <section style={{ marginBottom: 40, padding: 20, background: '#e8f5e9', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>PostgreSQL Database Operations</h2>

        {/* Create Post Form */}
        <div style={{ marginBottom: 30 }}>
          <h3>Create New Post</h3>
          <form onSubmit={createPost} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
            <input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title"
              required
              style={{ padding: 8, fontSize: 14 }}
            />
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Post content (optional)"
              rows={4}
              style={{ padding: 8, fontSize: 14, fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              disabled={dbLoading}
              style={{ padding: '10px 16px', background: '#4caf50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              {dbLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>

          {dbMessage && (
            <div style={{
              marginTop: 12,
              padding: 12,
              background: dbMessage.type === 'success' ? '#c8e6c9' : '#ffcdd2',
              borderRadius: 4,
              color: dbMessage.type === 'success' ? '#2e7d32' : '#c62828'
            }}>
              {dbMessage.text}
            </div>
          )}
        </div>

        {/* Posts List */}
        <div>
          <h3>Posts from Database ({posts.length})</h3>
          {posts.length === 0 ? (
            <p style={{ color: '#666' }}>No posts yet. Create your first post above!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: '#fff',
                    padding: 16,
                    borderRadius: 6,
                    border: '1px solid #c8e6c9'
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>{post.title}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#555' }}>{post.content || <em>No content</em>}</p>
                  <small style={{ color: '#999' }}>
                    Posted: {new Date(post.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}