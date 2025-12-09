# Network Setup Guide

## Running MulaSense on Network

This guide helps you run the MulaSense backend on your network so other devices can access it.

### Current Configuration
- **Your Computer IP**: `172.17.3.81`
- **Backend URL**: `http://172.17.3.81:8000`
- **Frontend URL**: `http://localhost:5173` (or your computer's IP)

### Quick Start

1. **Start Backend (Terminal 1)**:
   ```bash
   cd MulaSense
   run_network.bat
   ```
   Or manually:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Start Frontend (Terminal 2)**:
   ```bash
   cd "Mobile app"
   run_network.bat
   ```
   Or manually:
   ```bash
   npm run dev
   ```

### Access Points

- **Backend API**: `http://172.17.3.81:8000/api/`
- **Django Admin**: `http://172.17.3.81:8000/admin/`
- **Frontend**: `http://localhost:5173` (on your computer)
- **Mobile Access**: Use `http://172.17.3.81:8000/api/` in mobile app

### Firewall Configuration

If you can't access from other devices:

1. **Windows Firewall**:
   - Go to Windows Defender Firewall
   - Click "Allow an app through firewall"
   - Find Python or add it manually
   - Allow both Private and Public networks

2. **Alternative**: Temporarily disable Windows Firewall for testing

### Mobile App Configuration

The mobile app is already configured to use `http://172.17.3.81:8000/api/`

### Troubleshooting

1. **Can't access from other devices**:
   - Check Windows Firewall settings
   - Ensure both devices are on same network
   - Try accessing `http://172.17.3.81:8000` from browser

2. **IP Address Changed**:
   - Run `ipconfig` to get new IP
   - Update `.env` file in Mobile app folder
   - Restart frontend

3. **CORS Errors**:
   - Backend is configured to allow all origins
   - Check browser console for specific errors

### Network Commands

```bash
# Get your IP address
ipconfig

# Test backend connectivity
curl http://172.17.3.81:8000/api/

# Check if port is open
netstat -an | findstr :8000
```

### Production Notes

For production deployment:
- Use proper domain name instead of IP
- Enable HTTPS
- Configure proper CORS origins
- Use environment variables for configuration