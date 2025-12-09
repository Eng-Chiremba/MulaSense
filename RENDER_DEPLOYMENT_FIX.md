# Render Deployment Fix - "Not Found" Error

## Problem Diagnosis

Your frontend on Render is trying to connect to `http://localhost:8000/api` which doesn't exist in production. The login fails with "not found" because:

1. Frontend environment variable `VITE_API_BASE_URL` is not set on Render
2. Frontend defaults to localhost instead of your Render backend URL
3. CORS might be blocking requests

## Solution

### Step 1: Set Environment Variable on Render (Frontend)

1. Go to your Render Dashboard
2. Select your **Frontend** service
3. Go to **Environment** tab
4. Add this environment variable:

```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

Replace `your-backend-name` with your actual backend service name on Render.

### Step 2: Update Backend CORS Settings

Your backend needs to allow requests from your frontend domain.

Add to `settings.py`:

```python
# Get frontend URL from environment
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

# Update CORS settings
CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# Keep this for mobile app
CORS_ALLOW_ALL_ORIGINS = False  # Change to False for security
```

### Step 3: Set Environment Variables on Render (Backend)

1. Go to your **Backend** service on Render
2. Go to **Environment** tab
3. Add these variables:

```
DEBUG=False
SECRET_KEY=your-secret-key-here-generate-new-one
DATABASE_URL=your-postgres-url-from-render
FRONTEND_URL=https://your-frontend-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-name.onrender.com,http://localhost:5173
ALLOWED_HOSTS=your-backend-name.onrender.com,localhost,127.0.0.1
OPENROUTER_API_KEY=your-openrouter-key
```

### Step 4: Update Frontend Build Command on Render

Make sure your frontend build command includes the environment variable:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run preview
```

Or use a static site:
```bash
npm install && npm run build
```

### Step 5: Rebuild Both Services

1. Go to Render Dashboard
2. Click **Manual Deploy** > **Deploy latest commit** on BOTH services
3. Wait for deployment to complete

## Quick Fix (Temporary)

If you need a quick fix, update your frontend `.env` file:

```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

Then rebuild and redeploy frontend.

## Verification Steps

### 1. Check Backend is Running
Visit: `https://your-backend-name.onrender.com/api/users/login/`

You should see:
```json
{"detail": "Method \"GET\" not allowed."}
```

This means the endpoint exists (it only accepts POST).

### 2. Check Frontend Environment
Open browser console on your deployed frontend and check:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

Should show your backend URL, not localhost.

### 3. Test Login
Try logging in. Check Network tab in browser DevTools:
- Request URL should be `https://your-backend-name.onrender.com/api/users/login/`
- NOT `http://localhost:8000/api/users/login/`

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True  # Temporary for testing
CORS_ALLOW_CREDENTIALS = True
```

### Issue 2: 404 on Static Files
**Symptom:** CSS/JS files not loading

**Solution:**
```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

Run: `python manage.py collectstatic --noinput`

### Issue 3: Database Not Migrated
**Symptom:** "no such table" errors

**Solution:**
Add to Render build command:
```bash
python manage.py migrate && python manage.py collectstatic --noinput
```

### Issue 4: Environment Variables Not Loading
**Symptom:** Still connecting to localhost

**Solution:**
1. Verify env vars are set in Render dashboard
2. Restart the service
3. Check logs: `console.log(import.meta.env)`

## Render Configuration Files

### Backend: `render.yaml` (Optional)
```yaml
services:
  - type: web
    name: mulasense-backend
    env: python
    buildCommand: pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
    startCommand: gunicorn MulaSense.wsgi:application
    envVars:
      - key: DEBUG
        value: False
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Frontend: Build Settings
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: Your backend URL

## Testing Locally with Production Settings

Test your setup locally before deploying:

```bash
# Backend
export DEBUG=False
export DATABASE_URL=your-postgres-url
python manage.py runserver

# Frontend
export VITE_API_BASE_URL=http://localhost:8000/api
npm run build
npm run preview
```

## Debugging on Render

### View Backend Logs
```bash
# In Render dashboard, go to Logs tab
# Look for errors like:
# - "no such table"
# - "CORS error"
# - "404 not found"
```

### View Frontend Logs
```bash
# In browser console (F12)
# Check Network tab for failed requests
# Check Console tab for errors
```

## Final Checklist

- [ ] Backend deployed and running on Render
- [ ] Frontend deployed and running on Render
- [ ] `VITE_API_BASE_URL` set on frontend
- [ ] `FRONTEND_URL` set on backend
- [ ] CORS configured correctly
- [ ] Database migrated
- [ ] Static files collected
- [ ] Both services redeployed
- [ ] Login works without errors
- [ ] API calls go to correct URL (not localhost)

## Need More Help?

Check these URLs:
1. Backend health: `https://your-backend.onrender.com/admin/`
2. API endpoint: `https://your-backend.onrender.com/api/users/login/`
3. Frontend: `https://your-frontend.onrender.com/`

If still not working, share:
- Backend Render logs
- Frontend browser console errors
- Network tab screenshot showing the failed request
