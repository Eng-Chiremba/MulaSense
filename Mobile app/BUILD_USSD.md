# Building EcoCash USSD Feature

## Quick Build Steps

1. **Build the web app**
   ```bash
   cd "Mobile app"
   npm run build
   ```

2. **Sync with Android**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Build and Run**
   - In Android Studio, click "Run" or press Shift+F10
   - Select your physical Android device
   - Wait for build to complete

## Testing on Device

### Prerequisites
- Physical Android device (Android 8.0+)
- USB debugging enabled
- Active SIM card with EcoCash

### Grant Permissions
When you first run the app and try to use Send Money or Buy Airtime:
1. App will request CALL_PHONE permission
2. Tap "Allow" to grant permission
3. Try the transaction again

### Test Send Money
1. Open app → Navigate to EcoCash Payments
2. Click "New Payment"
3. Select "Send Money"
4. Choose currency (USD or ZIG)
5. Enter receiver number (e.g., 0774222475)
6. Enter amount
7. Click "Continue"
8. USSD prompt should appear automatically
9. Follow USSD prompts to complete

### Test Buy Airtime
1. Open app → Navigate to EcoCash Payments
2. Click "New Payment"
3. Select "Buy Airtime"
4. Choose currency (USD or ZIG)
5. Enter phone number
6. Enter amount
7. Click "Continue"
8. USSD prompt should appear automatically
9. Follow USSD prompts to complete

### Test Pay Merchant (API)
1. Open app → Navigate to EcoCash Payments
2. Click "New Payment"
3. Select "Pay Merchant"
4. Choose currency
5. Enter merchant code
6. Enter amount
7. Click "Pay with EcoCash"
8. Backend API processes payment

## Troubleshooting

### USSD Not Working
- Verify Android version is 8.0+
- Check CALL_PHONE permission is granted
- Ensure SIM card is active
- Test USSD manually: dial `*153#` or `*151#`

### Permission Denied
- Go to Settings → Apps → MulaSense → Permissions
- Enable "Phone" permission

### Build Errors
- Clean build: `cd android && ./gradlew clean`
- Rebuild: `./gradlew build`
- Sync Gradle files in Android Studio

### Plugin Not Found
- Verify `UssdPlugin.java` exists in correct path
- Check `MainActivity.java` registers the plugin
- Verify `capacitor.plugins.json` includes UssdPlugin
- Run `npx cap sync android` again

## USSD Codes Reference

### Send Money
- **USD**: `*153*1*1*{receiver}*{amount}#`
- **ZIG**: `*151*1*1*1*{receiver}*{amount}#`

### Buy Airtime
- **USD**: `*153*4*1*1*1*{amount}#`
- **ZIG**: `*151*1*4*1*1*1*{amount}#`

## Notes

- USSD only works on physical devices with SIM cards
- Emulators cannot execute USSD codes
- User must have sufficient EcoCash balance
- USSD execution is automatic - no dialer opens
