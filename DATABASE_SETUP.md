# PostgreSQL Database Setup Instructions

## Current Status

✅ **Code Implementation**: Complete and working
❌ **Database Connection**: Needs configuration

The application is trying to connect to PostgreSQL using placeholder credentials in `.env.local`. You need to configure it with your actual RDS PostgreSQL credentials.

---

## Option 1: Connect to AWS RDS PostgreSQL (Recommended for Production)

### Step 1: Update `.env.local` with Your RDS Credentials

Edit the file `c:\Users\pavan\Downloads\nextjs-fullstack-simple\.env.local`:

```env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
```

Replace with your actual RDS credentials:
- `DB_HOST`: Your RDS endpoint (e.g., `mydb.abc123.us-east-1.rds.amazonaws.com`)
- `DB_PORT`: Usually `5432` for PostgreSQL
- `DB_NAME`: The database name you created in RDS
- `DB_USER`: Your RDS master username
- `DB_PASSWORD`: Your RDS master password

### Step 2: Ensure RDS Security Group Allows Your IP

1. Go to AWS Console → RDS → Your Database → Security Groups
2. Edit inbound rules
3. Add rule: Type = PostgreSQL, Port = 5432, Source = Your IP address
4. Save rules

### Step 3: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The application will automatically create the `posts` table on first API call.

---

## Option 2: Use Local PostgreSQL for Testing

### Step 1: Install PostgreSQL Locally

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer and follow prompts
3. Remember the password you set for the `postgres` user

**Using Docker (Alternative):**
```bash
docker run --name postgres-local -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Create database
CREATE DATABASE testdb;

# Exit
\q
```

### Step 3: Update `.env.local`

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### Step 4: Restart Development Server

```bash
npm run dev
```

---

## Verification

Once configured, test the application:

1. **Navigate to**: http://localhost:3001
2. **Scroll down** to "PostgreSQL Database Operations" section
3. **Create a post**:
   - Title: "Test Post"
   - Content: "This is a test"
   - Click "Create Post"
4. **Verify**: Post appears in the list below

---

## Database Schema

The application automatically creates this table:

```sql
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

You can also run the SQL manually from `lib/schema.sql`.

---

## API Endpoints

### GET /api/posts
Retrieve all posts from database

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content",
      "created_at": "2025-11-29T06:10:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/posts
Create a new post

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Post Title",
    "content": "Post content",
    "created_at": "2025-11-29T06:10:00.000Z"
  },
  "message": "Post created successfully"
}
```

---

## Troubleshooting

### Error: "password authentication failed"
- Check your database credentials in `.env.local`
- Ensure the database user has correct password
- Verify the database exists

### Error: "Connection refused"
- Check if PostgreSQL is running
- Verify the host and port are correct
- Check firewall/security group settings

### Error: "database does not exist"
- Create the database using `CREATE DATABASE your_db_name;`
- Update `DB_NAME` in `.env.local`

### Error: "relation 'posts' does not exist"
- The table should be created automatically
- If not, run the SQL from `lib/schema.sql` manually

---

## Files Created

- `lib/db.js` - Database connection and query utilities
- `lib/schema.sql` - Database schema SQL
- `pages/api/posts.js` - REST API endpoint
- `.env.local` - Environment variables (update with your credentials)
- `.env.example` - Template for environment variables
- `.gitignore` - Excludes sensitive files from git

---

## Next Steps

1. **Configure Database**: Update `.env.local` with your RDS or local PostgreSQL credentials
2. **Restart Server**: `npm run dev`
3. **Test**: Create and view posts through the UI
4. **Deploy**: Follow AWS deployment guide when ready
