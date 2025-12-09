# Ecocash USSD Integration Setup

## Overview
The Ecocash feature allows users to execute USSD codes directly from the app for:
- Pay Service
- Send Money
- Buy Airtime

## Permissions Required

### Android
The `CALL_PHONE` permission has been added to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CALL_PHONE" />
```

### iOS
No additional permissions needed. The `tel:` URI scheme is supported by default.

## How It Works

1. User clicks "Ecocash" button on dashboard
2. Selects service type (Pay Service, Send Money, or Buy Airtime)
3. Enters currency (USD or ZIG), amount, and required details
4. If first time, OS prompts user to grant CALL_PHONE permission
5. App records transaction in database under "Other" expense category
6. **Android**: App automatically executes USSD (user only enters PIN when prompted)
7. **iOS**: App opens dialer with USSD code

## USSD Codes

### Pay Service
- USD: `*153*2*2*{agentCode}*{amount}#`
- ZIG: `*151*1*2*2*{agentCode}*{amount}#`

### Send Money
- USD: `*153*1*1*{receiverNumber}*{amount}#`
- ZIG: `*151*1*1*1*{receiverNumber}*{amount}#`

### Buy Airtime
- USD: `*153*4*1*1*{amount}#`
- ZIG: `*151*1*4*1*1*{amount}#`

## Building for Mobile

After making changes, rebuild and sync:

```bash
npm run build
npx cap sync android
npx cap open android
```

Or use the shortcut:
```bash
npm run android
```

## Testing

- **Web**: Shows alert with USSD code (for development)
- **Android**: Automatically executes USSD code
- **iOS**: Opens native dialer with USSD code

## Files Modified

1. `src/components/features/EcocashDialog.tsx` - Main dialog component
2. `src/services/ussd.service.ts` - USSD execution service with permission handling
3. `src/plugins/ussd.ts` - TypeScript plugin interface
4. `src/pages/Dashboard.tsx` - Added Ecocash button
5. `android/app/src/main/AndroidManifest.xml` - Added CALL_PHONE permission
6. `android/app/src/main/java/com/mulasense/app/UssdPlugin.java` - Native plugin
7. `android/app/src/main/java/com/mulasense/app/MainActivity.java` - Plugin registration
