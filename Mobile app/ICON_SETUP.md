# App Icon Setup - Quick Guide

## Problem
The logo.ico format isn't supported by Capacitor assets tool. Need PNG format.

## Solution

### Option 1: Convert logo.ico to PNG (Recommended)

1. **Convert online:**
   - Go to https://convertio.co/ico-png/
   - Upload `public/logo.ico`
   - Download as PNG (1024x1024 recommended)
   - Save as `resources/icon.png`

2. **Generate icons:**
   ```bash
   npx @capacitor/assets generate --android
   ```

### Option 2: Manual Icon Replacement

Replace these files with your logo (PNG format):
```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### Option 3: Use Online Icon Generator

1. Go to https://icon.kitchen/
2. Upload your logo
3. Download Android icon pack
4. Extract to `android/app/src/main/res/`

## Current Status
- Logo exists at: `public/logo.ico`
- Format: ICO (needs conversion to PNG)
- Target: Android app icon

## Next Steps
1. Convert logo.ico to PNG (1024x1024)
2. Save as `resources/icon.png`
3. Run: `npx @capacitor/assets generate --android`
4. Rebuild app: `npm run android:prod`
