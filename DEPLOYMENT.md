# MulaSense Backend Deployment Guide - Render

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Your code pushed to GitHub repository

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes to Git:**
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account & Connect GitHub

1. Go to https://render.com and sign up/login
2. Click "New +" button in the top right
3. Select "Web Service"
4. Connect your GitHub account if not already connected
5. Select your MulaSense repository

### Step 3: Configure Web Service

**Basic Settings:**
- **Name:** `mulasense-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (backend is in root)
- **Runtime:** `Python 3`

**Build & Deploy Settings:**
- **Build Command:** `./build.sh`
- **Start Command:** `gunicorn MulaSense.wsgi:application`

### Step 4: Add Environment Variables

Click "Advanced" and add these environment variables:

**Required Variables:**
```
SECRET_KEY = [Click "Generate" button for secure key]
DEBUG = False
PYTHON_VERSION = 3.11.0
```

**Database (will be auto-added when you create PostgreSQL):**
```
DATABASE_URL = [Will be provided by Render PostgreSQL]
```

**CORS Settings:**
```
ALLOWED_HOSTS = your-app-name.onrender.com
CORS_ALLOWED_ORIGINS = https://your-frontend-url.com,http://localhost:5173
```

**AI Configuration (if using AI features):**
```
OPENROUTER_API_KEY = your-actual-api-key
```

### Step 5: Create PostgreSQL Database

1. From Render Dashboard, click "New +" → "PostgreSQL"
2. **Name:** `mulasense-db`
3. **Database:** `mulasense`
4. **User:** `mulasense_user`
5. **Region:** Same as your web service
6. **Plan:** Free (for development)
7. Click "Create Database"

### Step 6: Link Database to Web Service

1. Go back to your Web Service settings
2. In Environment Variables, add:
   - **Key:** `DATABASE_URL`
   - **Value:** Copy the "Internal Database URL" from your PostgreSQL dashboard
3. Save changes

### Step 7: Deploy

1. Click "Create Web Service" button
2. Render will automatically:
   - Clone your repository
   - Install dependencies from requirements.txt
   - Run migrations
   - Collect static files
   - Start your application

### Step 8: Verify Deployment

1. Wait for build to complete (5-10 minutes first time)
2. Check build logs for any errors
3. Once deployed, visit: `https://your-app-name.onrender.com/api/`
4. You should see Django REST Framework browsable API

### Step 9: Link Mobile App to Backend

#### A. Get Your Backend URL
After deployment, your backend URL will be:
```
https://your-app-name.onrender.com
```

#### B. Update Mobile App Configuration

1. **Create/Update Mobile app/.env file:**
```bash
cd "Mobile app"
echo VITE_API_BASE_URL=https://your-app-name.onrender.com/api > .env
```

2. **Update API service file:**

**File: Mobile app/src/services/api.ts**
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
```

#### C. Update CORS in Backend

1. **In Render Dashboard → Environment Variables, update:**
```
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

2. **If testing locally with deployed backend:**
```
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://your-app-name.onrender.com
```

#### D. Test Connection

1. **Start mobile app:**
```bash
cd "Mobile app"
npm run dev
```

2. **Test API connection in browser console:**
```javascript
fetch('https://your-app-name.onrender.com/api/')
  .then(r => r.json())
  .then(console.log)
```

3. **Test login/register from mobile app**

#### E. Build for Production

**For Web:**
```bash
npm run build
```

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

## Incremental Delivery Strategy

Since your backend is not fully developed, follow this approach:

### Phase 1: Core Features (Current)
- ✅ User authentication
- ✅ Basic transaction management
- ✅ Budget tracking
- Deploy these working features first

### Phase 2: Add Features Incrementally
1. Develop new feature locally
2. Test thoroughly
3. Commit and push to GitHub
4. Render auto-deploys (if auto-deploy enabled)
5. Test on production
6. Repeat

### Enable Auto-Deploy
1. Go to your Web Service settings
2. Under "Build & Deploy"
3. Enable "Auto-Deploy: Yes"
4. Now every push to main branch auto-deploys

## Common Issues & Solutions

### Issue 1: Build Fails
**Solution:** Check build logs for specific error. Common causes:
- Missing dependencies in requirements.txt
- Python version mismatch
- Syntax errors

### Issue 2: Database Connection Error
**Solution:** 
- Verify DATABASE_URL is correctly set
- Ensure PostgreSQL database is running
- Check database credentials

### Issue 3: Static Files Not Loading
**Solution:**
- Ensure WhiteNoise is in MIDDLEWARE
- Run `python manage.py collectstatic` locally to test
- Check STATIC_ROOT and STATIC_URL settings

### Issue 4: CORS Errors
**Solution:**
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Include both http and https versions
- Don't forget trailing slashes

### Issue 5: 502 Bad Gateway
**Solution:**
- Check if gunicorn is starting correctly
- Verify WSGI application path: `MulaSense.wsgi:application`
- Check application logs for startup errors

## Monitoring & Maintenance

### View Logs
1. Go to your Web Service dashboard
2. Click "Logs" tab
3. Monitor real-time application logs

### Database Backups
1. Go to PostgreSQL dashboard
2. Render automatically backs up free tier databases
3. For manual backup, use pg_dump

### Update Environment Variables
1. Go to Web Service → Environment
2. Add/Edit variables
3. Click "Save Changes"
4. Service will automatically redeploy

## Testing Your Deployment

### Test API Endpoints
```bash
# Health check
curl https://your-app-name.onrender.com/api/

# Register user
curl -X POST https://your-app-name.onrender.com/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","phone_number":"+263771234567"}'

# Login
curl -X POST https://your-app-name.onrender.com/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test from Mobile App

1. **Update API_BASE_URL in Mobile app/.env**
2. **Start mobile app:** `npm run dev`
3. **Test these flows:**
   - ✅ User registration
   - ✅ User login
   - ✅ View dashboard
   - ✅ Create transaction
   - ✅ View transactions list
   - ✅ Create budget
   - ✅ AI chat (if configured)

### Common Connection Issues

**Issue: CORS Error**
```
Access to fetch at 'https://your-app.onrender.com/api/' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:** Add `http://localhost:5173` to CORS_ALLOWED_ORIGINS in Render environment variables

**Issue: Network Error**
```
Network Error / ERR_CONNECTION_REFUSED
```
**Solution:** 
- Check if backend is running (visit URL in browser)
- Verify API_BASE_URL is correct
- Check if service is spinning up (free tier)

**Issue: 401 Unauthorized**
```
{"detail": "Authentication credentials were not provided."}
```
**Solution:** Ensure token is being sent in Authorization header

## Scaling Considerations

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### Upgrade When Needed
- **Starter Plan ($7/month):** No spin-down, better performance
- **Standard Plan ($25/month):** More resources, better for production

## Security Checklist

- ✅ DEBUG = False in production
- ✅ SECRET_KEY is randomly generated
- ✅ ALLOWED_HOSTS configured
- ✅ CORS properly configured
- ✅ Database credentials secure
- ✅ API keys in environment variables
- ✅ HTTPS enabled (automatic on Render)

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get backend URL (https://your-app-name.onrender.com)
3. ✅ Update Mobile app/.env with backend URL
4. ✅ Test connection from mobile app
5. ✅ Test all features (login, transactions, budget)
6. Continue developing new features locally
7. Push updates incrementally (auto-deploy)
8. Monitor logs and performance

## Mobile App Deployment (Optional)

Once backend is stable, deploy mobile app:

### Web Hosting (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variable: `VITE_API_BASE_URL`

### Android APK
1. Update `capacitor.config.ts` with production URL
2. Build: `npm run android`
3. Open Android Studio
4. Build → Generate Signed Bundle/APK

### iOS App
1. Update `capacitor.config.ts` with production URL
2. Build: `npm run ios`
3. Open Xcode
4. Archive and upload to App Store Connect

## Environment Variables Reference

### Backend (Render)
```bash
SECRET_KEY=<generate-random-key>
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
DATABASE_URL=<provided-by-render-postgresql>
CORS_ALLOWED_ORIGINS=https://your-frontend.com,http://localhost:5173
OPENROUTER_API_KEY=<your-api-key>
```

### Frontend (Mobile app/.env)
```bash
VITE_API_BASE_URL=https://your-app-name.onrender.com/api
```

## Support Resources

- Render Documentation: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.2/howto/deployment/
- Render Community: https://community.render.com/
- Capacitor Docs: https://capacitorjs.com/docs

## Rollback Strategy

If deployment fails:
1. Go to "Events" tab in Render dashboard
2. Find previous successful deploy
3. Click "Rollback to this version"
4. Fix issues locally
5. Redeploy when ready
