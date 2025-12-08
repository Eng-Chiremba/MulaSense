# USSD Automatic Execution Implementation

## Overview
This implementation enables automatic USSD execution without redirecting users to the dialer, providing a seamless in-app experience for Ecocash transactions.

## Technical Approach

### Android API Level 26+ (Android 8.0+)
The implementation uses `TelephonyManager.sendUssdRequest()` API introduced in Android Oreo (API 26), which allows apps to:
- Execute USSD codes programmatically
- Receive USSD responses directly in the app
- No dialer interaction required

### Key Components

#### 1. UssdPlugin.java (Native Android)
- Uses `TelephonyManager.sendUssdRequest()` for automatic execution
- Implements `UssdResponseCallback` to capture responses
- Handles success and failure scenarios
- Requires `CALL_PHONE` permission

#### 2. ussd.ts (TypeScript Interface)
- Capacitor plugin registration
- Type-safe interface for USSD operations
- Returns response data from USSD execution

#### 3. ussd.service.ts (Service Layer)
- Permission checking and requesting
- Error handling
- Platform detection (Android only)

#### 4. EcocashDialog.tsx (UI Component)
- User-friendly interface for Ecocash services
- Automatic transaction recording
- Response display via toast notifications

## Requirements

### Permissions
Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CALL_PHONE" />
```

### Minimum Android Version
- Android 8.0 (API Level 26) or higher
- For older versions, falls back to dialer method

## Usage Flow

1. User selects Ecocash service (Pay Service, Send Money, Buy Airtime)
2. User enters required details (amount, agent code, etc.)
3. App requests CALL_PHONE permission if not granted
4. USSD code is executed automatically via TelephonyManager
5. Response is captured and displayed to user
6. Transaction is recorded in the system

## USSD Codes Supported

### USD Currency (*153#)
- Pay Service: `*153*2*2*{agentCode}*{amount}#`
- Send Money: `*153*1*1*{receiverNumber}*{amount}#`
- Buy Airtime: `*153*4*1*1*{amount}#`

### ZIG Currency (*151#)
- Pay Service: `*151*1*2*2*{agentCode}*{amount}#`
- Send Money: `*151*1*1*1*{receiverNumber}*{amount}#`
- Buy Airtime: `*151*1*4*1*1*{amount}#`

## Error Handling

### Permission Denied
- User is notified via toast
- Transaction is not executed

### USSD Execution Failed
- Error code is captured
- User-friendly error message displayed
- Transaction is not recorded

### Network Issues
- TelephonyManager handles network errors
- Callback receives failure notification

## Testing

### Build and Deploy
```bash
cd "Mobile app"
npm run build
npx cap sync android
npm run android
```

### Test Scenarios
1. First-time permission request
2. Successful USSD execution
3. Failed USSD execution
4. Network unavailable
5. Invalid USSD code

## Limitations

1. **Android Only**: iOS doesn't support programmatic USSD execution
2. **API Level 26+**: Older Android versions not supported
3. **Carrier Support**: Some carriers may block programmatic USSD
4. **SIM Required**: Device must have active SIM card
5. **Network Dependent**: Requires cellular network connection

## Security Considerations

1. **Permission Model**: Uses runtime permissions (Android 6.0+)
2. **User Consent**: Permission dialog shown before execution
3. **Transaction Recording**: All transactions logged for audit
4. **No Credential Storage**: USSD codes generated on-the-fly

## Future Enhancements

1. **Response Parsing**: Extract transaction details from USSD response
2. **Multi-step USSD**: Handle interactive USSD sessions
3. **Retry Logic**: Automatic retry on network failures
4. **Offline Queue**: Queue transactions when offline
5. **Transaction Confirmation**: Parse success/failure from response

## Troubleshooting

### USSD Not Executing
- Check Android version (must be 8.0+)
- Verify CALL_PHONE permission granted
- Ensure SIM card is active
- Check network connectivity

### Permission Issues
- Reinstall app to reset permissions
- Check app settings in Android system

### Response Not Received
- Some carriers delay responses
- Network congestion may cause timeouts
- USSD service may be temporarily unavailable

## References

- [Android TelephonyManager Documentation](https://developer.android.com/reference/android/telephony/TelephonyManager)
- [USSD API Guide](https://developer.android.com/reference/android/telephony/TelephonyManager#sendUssdRequest(java.lang.String,%20android.telephony.TelephonyManager.UssdResponseCallback,%20android.os.Handler))
- [Capacitor Plugin Development](https://capacitorjs.com/docs/plugins)
