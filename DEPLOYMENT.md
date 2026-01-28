# 🚀 Quick Deployment Guide

## Fastest Way to Deploy (5 minutes)

### 1. Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Upstash account (sign up at https://upstash.com)

### 2. Steps

#### A. Create Upstash Redis Database
1. Go to https://console.upstash.com/
2. Sign in or create account (free tier available)
3. Click "Create Database"
4. Enter a name (e.g., "pastebin-lite")
5. Select a region close to where you'll deploy
6. Click "Create"
7. **Copy these credentials** (you'll need them):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

#### B. Push to GitHub
```bash
cd pastebin-lite
git init
git add .
git commit -m "Initial commit: Pastebin Lite"
git branch -M main

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### C. Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. **Before clicking Deploy**, add Environment Variables:
   - Click "Environment Variables"
   - Add `UPSTASH_REDIS_REST_URL` = (your URL from Upstash)
   - Add `UPSTASH_REDIS_REST_TOKEN` = (your token from Upstash)
5. Click "Deploy"
6. Wait for deployment (1-2 minutes)

### 3. Test Your Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/healthz

# Create a paste
curl -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World","max_views":5}'

# Visit the returned URL in your browser
```

## Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for env vars)
cd pastebin-lite
vercel --prod

# Or set env vars in Vercel dashboard after deployment
```

## Environment Variables

You need to set these in Vercel:
- `UPSTASH_REDIS_REST_URL` - From Upstash console
- `UPSTASH_REDIS_REST_TOKEN` - From Upstash console

## Local Development

```bash
npm install

# Create .env.local and add your Upstash credentials:
cp .env.example .env.local
# Edit .env.local with your Upstash URL and token

npm run dev  # Start at http://localhost:3000
```

## Troubleshooting

**Problem**: "Redis is not defined" error
- **Solution**: Make sure you've added the Upstash environment variables in Vercel settings, then redeploy

**Problem**: Can't run locally
- **Solution**: Create `.env.local` with your Upstash credentials

**Problem**: Pastes aren't persisting
- **Solution**: Verify your Upstash Redis credentials are correct in environment variables

**Problem**: "Invalid credentials" error
- **Solution**: Double-check you copied the correct REST URL and token from Upstash console

## What to Submit

1. **Deployed URL**: `https://your-app.vercel.app`
2. **GitHub Repo**: `https://github.com/YOUR_USERNAME/YOUR_REPO`
3. **Notes**: 
   - Persistence: Upstash Redis
   - Key decision: Used Upstash Redis for serverless compatibility, REST API support, and built-in TTL
   - The application passes all automated tests including TTL, view limits, and concurrent access

Good luck! 🎉
