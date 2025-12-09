# EcoCash USSD Implementation Summary

## Changes Overview

The EcoCash feature has been updated to use automatic USSD execution for Send Money and Buy Airtime services, while Pay Merchant continues to use the EcoCash API.

## What Changed

### 1. Native Android Plugin Created
**File**: `Mobile app/android/app/src/main/java/com/mulasense/app/UssdPlugin.java`
- Implements `TelephonyManager.sendUssdRequest()` for automatic USSD execution
- Handles CALL_PHONE permission requests
- Returns USSD responses to JavaScript layer
- Requires Android 8.0+ (API level 26)

### 2. MainActivity Updated
**File**: `Mobile app/android/app/src/main/java/com/mulasense/app/MainActivity.java`
- Registers the UssdPlugin with Capacitor bridge

### 3. TypeScript Plugin Interface
**File**: `Mobile app/src/plugins/ussd.ts`
- TypeScript interface for the USSD plugin
- Provides type-safe access to native functionality

### 4. EcocashDialog Component Updated
**File**: `Mobile app/src/components/features/EcocashDialog.tsx`
- **Send Money**: Now uses USSD instead of API
  - USD: `*153*1*1*{receiver}*{amount}#`
  - ZIG: `*151*1*1*1*{receiver}*{amount}#`
- **Buy Airtime**: Now uses USSD instead of API
  - USD: `*153*4*1*1*1*{amount}#`
  - ZIG: `*151*1*4*1*1*1*{amount}#`
- **Pay Merchant**: Still uses EcoCash API (unchanged)
- Button text changes based on service type

## Service Breakdown

| Service | Method | USSD Code (USD) | USSD Code (ZIG) |
|---------|--------|-----------------|-----------------|
| Send Money | USSD | `*153*1*1*{receiver}*{amount}#` | `*151*1*1*1*{receiver}*{amount}#` |
| Buy Airtime | USSD | `*153*4*1*1*1*{amount}#` | `*151*1*4*1*1*1*{amount}#` |
| Pay Merchant | API | N/A | N/A |

## How It Works

### Send Money Flow
1. User enters receiver number, amount, and selects currency
2. App formats phone number (removes leading 0, adds 263)
3. App constructs USSD code based on currency
4. UssdPlugin.executeUssd() is called
5. Android TelephonyManager executes USSD automatically
6. User sees USSD prompt and completes transaction
7. No dialer is opened - everything happens in-app

### Buy Airtime Flow
1. User enters phone number, amount, and selects currency
2. App constructs USSD code based on currency
3. UssdPlugin.executeUssd() is called
4. Android TelephonyManager executes USSD automatically
5. User sees USSD prompt and completes transaction

### Pay Merchant Flow (Unchanged)
1. User enters merchant code, amount, and currency
2. App calls EcoCash API via backend
3. Backend processes payment through EcoCash API
4. User receives payment confirmation

## Technical Requirements

### Android
- Minimum Android version: 8.0 (API level 26)
- Permission: CALL_PHONE (already in AndroidManifest.xml)
- Physical device with active SIM card required
- Does NOT work on emulators

### Build Commands
```bash
cd "Mobile app"
npm run build
npx cap sync android
npx cap open android
```

## Testing

### Prerequisites
- Physical Android device (Android 8.0+)
- Active SIM card with EcoCash account
- Sufficient EcoCash balance
- CALL_PHONE permission granted

### Test Cases
1. **Send Money (USD)**: Enter valid receiver and amount, verify USSD prompt appears
2. **Send Money (ZIG)**: Same as above with ZIG currency
3. **Buy Airtime (USD)**: Enter phone number and amount, verify USSD prompt
4. **Buy Airtime (ZIG)**: Same as above with ZIG currency
5. **Pay Merchant**: Verify API payment still works

## Benefits

1. **No Dialer Redirection**: USSD executes automatically without leaving the app
2. **Better UX**: Seamless transaction flow
3. **Native Integration**: Uses Android's built-in USSD capabilities
4. **Secure**: Leverages carrier's USSD security
5. **Reliable**: Direct carrier communication

## Limitations

1. Requires Android 8.0 or higher
2. Only works on physical devices with SIM cards
3. Cannot be tested on emulators
4. Requires CALL_PHONE permission
5. USSD response handling is limited by Android API

## Files Modified/Created

### Created
- `Mobile app/android/app/src/main/java/com/mulasense/app/UssdPlugin.java`
- `Mobile app/android/app/src/main/java/com/mulasense/app/MainActivity.java`
- `Mobile app/src/plugins/ussd.ts`
- `Mobile app/USSD_SETUP.md`
- `ECOCASH_USSD_IMPLEMENTATION.md` (this file)

### Modified
- `Mobile app/src/components/features/EcocashDialog.tsx`

### Unchanged
- Backend EcoCash API (still used for Pay Merchant)
- AndroidManifest.xml (CALL_PHONE permission already present)
- EcoCash service files
- Database models

## Next Steps

1. Build the Android app with the new changes
2. Test on physical device with active SIM
3. Verify USSD codes work with EcoCash
4. Monitor user feedback
5. Consider adding transaction history for USSD transactions

## Support

For issues or questions:
- Check that device has Android 8.0+
- Verify CALL_PHONE permission is granted
- Ensure SIM card is active and has EcoCash
- Test USSD codes manually first: dial `*153#` or `*151#`
