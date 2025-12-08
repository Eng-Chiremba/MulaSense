# MulaSense Android Build Instructions

## Build Production APK (Live Server)

Uses `https://mulasense.onrender.com/api`

```bash
# Build and open Android Studio
npm run android:prod

# In Android Studio:
# 1. Build > Generate Signed Bundle / APK
# 2. Select APK
# 3. Create/select keystore
# 4. Build release APK
# 5. APK location: android/app/build/outputs/apk/release/app-release.apk
```

## Build Development APK (Local Server)

Uses `http://localhost:8000/api`

```bash
# Build and open Android Studio
npm run android:dev

# Follow same steps as production
```

## Quick Install on Phone

### Production Build
```bash
npm run android:prod
# Then in Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
# Transfer APK to phone and install
```

### Development Build
```bash
npm run android:dev
# Same process as production
```

## Version Info
- Version Code: 2
- Version Name: 1.1
- Package: com.mulasense.app

## Switch Between Environments

**For Production (default):**
- `.env` already set to `https://mulasense.onrender.com/api`
- Run: `npm run android:prod`

**For Local Development:**
- `.env.local` set to `http://localhost:8000/api`
- Run: `npm run android:dev`

## Testing

**Production APK:**
- Install on phone
- App connects to live Render server
- No local backend needed

**Development APK:**
- Install on phone
- Requires local backend running: `python manage.py runserver 0.0.0.0:8000`
- Phone must be on same network as dev machine
