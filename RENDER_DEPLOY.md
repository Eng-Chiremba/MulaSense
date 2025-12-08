# Render Deployment Guide

## Quick Deploy (5 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy on Render

**Option A: Using Blueprint (Recommended)**
1. Go to https://render.com/dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repo
4. Render will detect `render.yaml` and auto-configure
5. Click "Apply" to deploy

**Option B: Manual Setup**
1. Go to https://render.com/dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** mulasense-backend
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn MulaSense.wsgi:application`
5. Add environment variables (see below)
6. Click "Create Web Service"

### 3. Add Environment Variables

In Render Dashboard → Environment (these override .env):
```
SECRET_KEY = [Click "Generate" for random key]
DEBUG = False
ALLOWED_HOSTS = your-app-name.onrender.com
CORS_ALLOWED_ORIGINS = capacitor://localhost,http://localhost,ionic://localhost,https://localhost
OPENROUTER_API_KEY = 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
DATABASE_URL = [Auto-added if using Render PostgreSQL]
```

**Notes:** 
- CORS origins are for mobile app (capacitor protocol)
- ALLOWED_HOSTS is your Render URL
- OpenRouter API uses model: `meta-llama/llama-3.1-8b-instruct`

### 4. Create PostgreSQL Database (Optional but Recommended)

1. Click "New" → "PostgreSQL"
2. Name: `mulasense-db`
3. Click "Create Database"
4. Copy "Internal Database URL"
5. Add to Web Service environment as `DATABASE_URL`

### 5. Get Your Backend URL

After deployment completes:
```
https://your-app-name.onrender.com
```

## Connect Mobile App to Backend

### Update Mobile App Configuration

**File: Mobile app/.env**
```bash
VITE_API_BASE_URL=https://your-app-name.onrender.com/api
```

**Update CORS in Render:**
```
CORS_ALLOWED_ORIGINS=capacitor://localhost,http://localhost,http://localhost:5173,ionic://localhost,https://localhost
```

### Test Connection

```bash
cd "Mobile app"
npm run dev
```

Test login/register from the app.

## Incremental Updates

With auto-deploy enabled:
```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main
# Render auto-deploys in ~2 minutes
```

## Common Issues

**Build fails:** Check logs in Render dashboard
**CORS errors:** Add your origin to CORS_ALLOWED_ORIGINS
**502 errors:** Check if gunicorn command is correct
**Database errors:** Verify DATABASE_URL is set

## Free Tier Notes

- Service spins down after 15 minutes inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free
- Upgrade to Starter ($7/mo) for always-on service

## Support

Check Render logs for errors:
Dashboard → Your Service → Logs
