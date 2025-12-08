# Quick Deploy Guide - MulaSense Backend to Render

## 🚀 5-Minute Deployment

### Step 1: Push to GitHub (1 min)
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Step 2: Create Render Web Service (2 min)
1. Go to https://render.com → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select **MulaSense** repo
4. Configure:
   - **Name:** `mulasense-backend`
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn MulaSense.wsgi:application`

### Step 3: Add Environment Variables (1 min)
Click **"Advanced"** and add:
```
SECRET_KEY = [Click Generate]
DEBUG = False
PYTHON_VERSION = 3.11.0
```

### Step 4: Create Database (1 min)
1. Click **"New +"** → **"PostgreSQL"**
2. Name: `mulasense-db`
3. Copy **"Internal Database URL"**
4. Go back to Web Service → Environment → Add:
   ```
   DATABASE_URL = [paste database URL]
   ```

### Step 5: Deploy! (5-10 min build time)
Click **"Create Web Service"** → Wait for build

---

## 🔗 Link Mobile App to Backend

### After Deployment Completes:

1. **Copy your backend URL:**
   ```
   https://mulasense-backend.onrender.com
   ```

2. **Run setup script:**
   ```bash
   cd "Mobile app"
   setup-production.bat
   ```
   Enter your backend URL when prompted.

3. **Test connection:**
   ```bash
   npm run dev
   ```

4. **Try login/register from mobile app**

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Render Web Service created
- [ ] PostgreSQL database created
- [ ] Environment variables added
- [ ] Build completed successfully
- [ ] Backend URL copied
- [ ] Mobile app .env updated
- [ ] Connection tested
- [ ] Login/register working

---

## 🆘 Quick Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Verify `build.sh` has execute permissions

**Can't connect from mobile app?**
- Add to CORS_ALLOWED_ORIGINS: `http://localhost:5173`
- Check backend URL is correct in .env

**Database error?**
- Verify DATABASE_URL is set correctly
- Check PostgreSQL is running

---

## 📱 Next: Deploy Mobile App

### Web (Netlify/Vercel):
```bash
npm run build
# Deploy dist/ folder
```

### Android APK:
```bash
npm run android
# Open Android Studio → Build APK
```

### iOS:
```bash
npm run ios
# Open Xcode → Archive
```

---

## 🔄 Incremental Updates

Enable **Auto-Deploy** in Render:
1. Web Service → Settings
2. Auto-Deploy: **Yes**
3. Now every `git push` auto-deploys!

Workflow:
```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main
# Render auto-deploys in ~5 minutes
```
