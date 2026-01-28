# Pastebin Lite

A lightweight pastebin application that allows users to create and share text snippets with optional time-based expiry (TTL) and view-count limits.

## Features

- 📝 Create text pastes with shareable URLs
- ⏰ Optional time-to-live (TTL) expiration
- 👁️ Optional view-count limits
- 🚀 Fast and lightweight
- 💾 Persistent storage using Vercel KV (Redis)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Persistence**: Vercel KV (Redis)
- **Deployment**: Vercel
- **Styling**: Inline CSS (no external dependencies)

## Persistence Layer

This application uses **Upstash Redis** for data persistence. Upstash is a serverless Redis database that provides:

- Fast key-value storage
- Automatic TTL support for expiring pastes
- Serverless-friendly (no connection pooling issues)
- Built-in scaling and reliability
- REST API for edge compatibility

The Redis storage handles:
- Paste content and metadata
- Automatic expiration via Redis TTL
- View count tracking
- Atomic operations for concurrent requests

## Design Decisions

1. **Upstash Redis**: Chosen for its serverless compatibility, built-in TTL support, REST API, and simple key-value interface perfect for this use case.

2. **Next.js App Router**: Modern React framework with excellent API route support and server-side rendering.

3. **Inline Styles**: Keeps the project simple without external CSS dependencies, easier to maintain.

4. **Deterministic Time Testing**: Supports `TEST_MODE` environment variable and `x-test-now-ms` header for automated testing.

5. **View Count on Both API and HTML**: Both the API endpoint and HTML page increment view count to properly track all views.

6. **Atomic View Counting**: View count is incremented after checking availability but before returning the response to avoid race conditions.

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns the health status of the application and KV connection.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "string (required)",
  "ttl_seconds": 60 (optional, integer >= 1),
  "max_views": 5 (optional, integer >= 1)
}
```

Returns:
```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}
```

### Fetch Paste (API)
```
GET /api/pastes/:id
```

Returns:
```json
{
  "content": "string",
  "remaining_views": 4 | null,
  "expires_at": "2026-01-01T00:00:00.000Z" | null
}
```

### View Paste (HTML)
```
GET /p/:id
```

Returns an HTML page displaying the paste content with metadata.

## Running Locally

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for KV storage)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Upstash Redis**
   
   a. Go to https://console.upstash.com/
   
   b. Create a new account or sign in
   
   c. Click "Create Database"
   
   d. Choose a name and region (choose one close to your deployment region)
   
   e. Click "Create"
   
   f. Copy the REST API credentials:
      - `UPSTASH_REDIS_REST_URL`
      - `UPSTASH_REDIS_REST_TOKEN`

4. **Create .env.local file**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your Upstash credentials:
   ```
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Deployment to Vercel

### Option 1: Deploy via CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Add Environment Variables**
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add:
     - `UPSTASH_REDIS_REST_URL` (from Upstash console)
     - `UPSTASH_REDIS_REST_TOKEN` (from Upstash console)
   - Redeploy the project

### Option 2: Deploy via GitHub

1. **Create Upstash Redis Database**
   - Go to https://console.upstash.com/
   - Create a new Redis database
   - Copy the REST API URL and Token

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Add Environment Variables**
   - Before deploying, add environment variables:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - Click "Deploy"

### Environment Variables

Required environment variables:

- `UPSTASH_REDIS_REST_URL` - Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis REST token

For testing mode (optional):
- `TEST_MODE=1` - Enables deterministic time testing

## Testing

The application supports deterministic time testing for automated tests:

- Set `TEST_MODE=1` environment variable
- Send `x-test-now-ms` header with milliseconds since epoch
- The application will use this time for TTL calculations

Example:
```bash
curl -H "x-test-now-ms: 1704067200000" \
     https://your-app.vercel.app/api/pastes/abc123
```

## Project Structure

```
pastebin-lite/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check endpoint
│   │   └── pastes/
│   │       ├── route.ts           # Create paste endpoint
│   │       └── [id]/
│   │           └── route.ts       # Fetch paste endpoint
│   ├── p/
│   │   └── [id]/
│   │       ├── page.tsx           # View paste HTML page
│   │       └── not-found.tsx      # 404 page
│   ├── page.tsx                   # Home page with create form
│   └── layout.tsx                 # Root layout
├── lib/
│   ├── kv.ts                      # KV database operations
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # Utility functions
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Error Handling

- **400 Bad Request**: Invalid input (missing content, invalid TTL/max_views)
- **404 Not Found**: Paste doesn't exist, expired, or view limit exceeded
- **500 Internal Server Error**: Server-side errors

All errors return JSON responses with an `error` field.

## License

MIT

## Author

Created for a take-home assignment.
