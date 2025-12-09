# MulaSense Deployment Guide

## Backend (Already Deployed)
- URL: https://mulasense.onrender.com
- Platform: Render

## Frontend Web Deployment on Render

### Prerequisites
- GitHub repository with the code
- Render account

### Deployment Steps

1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare frontend for web deployment"
   git push origin main
   ```

2. **Create New Static Site on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: mulasense-frontend
     - **Root Directory**: Mobile app
     - **Build Command**: `npm install && npm run build:web`
     - **Publish Directory**: `Mobile app/dist`
   - Click "Create Static Site"

3. **Environment Variables** (Optional)
   - The production API URL is already set in `.env.production`
   - No additional environment variables needed

### Alternative: Using render.yaml (Recommended)

1. **Deploy via render.yaml**
   - The `render.yaml` file is already configured in `Mobile app/`
   - In Render Dashboard, go to "Blueprint" → "New Blueprint Instance"
   - Connect repository and select the `Mobile app/render.yaml` file
   - Render will automatically configure everything

### Build Commands Reference
- **Development**: `npm run dev`
- **Web Production Build**: `npm run build:web`
- **Mobile Android**: `npm run android`
- **Mobile iOS**: `npm run ios`

### Configuration Files
- `.env` - Development (localhost)
- `.env.production` - Production (Render backend)
- `render.yaml` - Render deployment config
- `vercel.json` - Vercel deployment config (alternative)
- `netlify.toml` - Netlify deployment config (alternative)

### Post-Deployment
- Frontend will be available at: `https://mulasense-frontend.onrender.com` (or your custom domain)
- Backend API: `https://mulasense.onrender.com/api`

### Troubleshooting
- If routes don't work, ensure SPA rewrites are configured (already in render.yaml)
- Check browser console for CORS errors
- Verify backend CORS settings allow frontend domain
