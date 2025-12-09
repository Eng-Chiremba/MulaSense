# Frontend Web Deployment - Quick Start

## ✅ Configuration Complete

Your frontend is ready for web deployment on Render with zero conflicts with mobile builds.

## 🚀 Deploy to Render (2 Methods)

### Method 1: Manual Setup (Recommended)
1. Go to https://dashboard.render.com
2. Click **New +** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mulasense-frontend`
   - **Root Directory**: `Mobile app`
   - **Build Command**: `npm install && npm run build:web`
   - **Publish Directory**: `Mobile app/dist`
5. Click **Create Static Site**

### Method 2: Blueprint (Automated)
1. Go to https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect repository
4. Select `Mobile app/render.yaml`
5. Deploy

## 📦 Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build:web` | Web production build |
| `npm run build` | Mobile build (unchanged) |
| `npm run android` | Android build (unchanged) |
| `npm run ios` | iOS build (unchanged) |

## 🔧 Configuration Files

- ✅ `.env` - Development (localhost:8000)
- ✅ `.env.production` - Production (mulasense.onrender.com)
- ✅ `render.yaml` - Render deployment config
- ✅ `vite.config.ts` - Updated with build settings
- ✅ `package.json` - Added `build:web` script

## 🌐 URLs After Deployment

- **Backend API**: https://mulasense.onrender.com/api
- **Frontend**: https://mulasense-frontend.onrender.com (or your custom name)

## ✨ No Conflicts

- Mobile builds (`npm run android/ios`) use default `npm run build`
- Web deployment uses `npm run build:web` 
- Both work independently without conflicts
- CORS already configured on backend to accept all origins

## 🔍 Verify Deployment

After deployment, test:
1. Open frontend URL
2. Try login/register
3. Check browser console for API connection
4. Verify transactions, budget, AI features work

## 🐛 Troubleshooting

- **404 on routes**: SPA rewrites configured in render.yaml ✅
- **API errors**: Backend CORS allows all origins ✅
- **Build fails**: Check Node version (use 18.x or 20.x)
