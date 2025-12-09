# EcoCash USSD Integration Setup

## Overview
The EcoCash feature now uses automatic USSD execution for Send Money and Buy Airtime services, while Pay Merchant continues to use the EcoCash API.

## USSD Codes

### Send Money
- **USD**: `*153*1*1*{receiver}*{amount}#`
- **ZIG**: `*151*1*1*1*{receiver}*{amount}#`

### Buy Airtime
- **USD**: `*153*4*1*1*1*{amount}#`
- **ZIG**: `*151*1*4*1*1*1*{amount}#`

## Implementation

### Native Android Plugin
The USSD functionality is implemented using Android's `TelephonyManager.sendUssdRequest()` API, which requires:
- Android 8.0 (API level 26) or higher
- CALL_PHONE permission

### Files Created
1. `android/app/src/main/java/com/mulasense/app/UssdPlugin.java` - Native Android plugin
2. `android/app/src/main/java/com/mulasense/app/MainActivity.java` - Plugin registration
3. `src/plugins/ussd.ts` - TypeScript interface

### Permissions
The app already has `CALL_PHONE` permission in AndroidManifest.xml, which is required for USSD execution.

## Usage

### Send Money
1. User selects "Send Money" service
2. Enters receiver number, amount, and currency
3. Clicks "Pay with EcoCash"
4. USSD code is automatically executed without opening dialer
5. User completes transaction on USSD prompt

### Buy Airtime
1. User selects "Buy Airtime" service
2. Enters phone number, amount, and currency
3. Clicks "Pay with EcoCash"
4. USSD code is automatically executed
5. User completes transaction on USSD prompt

### Pay Merchant
1. User selects "Pay Merchant" service
2. Enters merchant code, amount, and currency
3. Clicks "Pay with EcoCash"
4. Uses EcoCash API for payment processing

## Building

After making these changes, rebuild the Android app:

```bash
npm run build
npx cap sync android
npx cap open android
```

Then build and run from Android Studio.

## Testing

Test on a physical Android device with:
- Android 8.0 or higher
- Active SIM card with EcoCash
- CALL_PHONE permission granted

## Notes

- USSD execution requires a physical device with an active SIM card
- Does not work on emulators
- User must have sufficient EcoCash balance
- USSD responses are handled by the native Android system
