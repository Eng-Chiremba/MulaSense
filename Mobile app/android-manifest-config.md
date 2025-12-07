# Enable Screenshots in Android App

## After building the Android app, update AndroidManifest.xml:

Location: `android/app/src/main/AndroidManifest.xml`

Remove or comment out this line if present:
```xml
android:screenOrientation="portrait"
```

Ensure this flag is NOT present (or set to false):
```xml
android:windowDisablePreview="false"
```

Add this to allow screenshots:
```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">
    
    <!-- No FLAG_SECURE means screenshots are allowed -->
    
</application>
```

## Note:
By default, Capacitor apps allow screenshots. Only if FLAG_SECURE was explicitly set would screenshots be blocked.
