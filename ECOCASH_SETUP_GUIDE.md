# EcoCash API Setup Guide

## Quick Setup Steps

### 1. Environment Configuration

Add to your `.env` file:
```bash
ECOCASH_API_KEY=1wddI46HBW3pK7pH32wgr3st9wIM7E4w
ECOCASH_SANDBOX=True
```

### 2. Database Migration

Run these commands in your terminal:
```powershell
# Activate virtual environment
& "C:\Users\HP Zbook\MulaSense\.venv\Scripts\Activate.ps1"

# Create migrations
python manage.py makemigrations ecocash

# Apply migrations
python manage.py migrate ecocash
```

### 3. Test the Integration

**Backend Test:**
```python
# In Django shell: python manage.py shell
from ecocash.services import EcoCashService

service = EcoCashService()
result = service.process_payment(
    customer_msisdn="263774222475",
    amount=10.50,
    reason="Test payment",
    currency="USD"
)
print(result)
```

**Frontend Test:**
```typescript
// In your React component
import ecocashService from '@/services/ecocash.service';

const testPayment = async () => {
  try {
    const payment = await ecocashService.sendMoney({
      recipient_msisdn: "263774222475",
      amount: 10.50,
      reason: "Test payment",
      currency: "USD"
    });
    console.log('Payment successful:', payment);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### 4. API Endpoints Available

Once setup is complete, these endpoints will be available:

- `POST /api/ecocash/send-money/`
- `POST /api/ecocash/buy-airtime/`
- `POST /api/ecocash/pay-merchant/`
- `GET /api/ecocash/payments/`

### 5. Testing with Sandbox

Use these test values:
- **Phone Number:** `263774222475`
- **PIN Codes:** `0000`, `1234`, or `9999`
- **Currency:** `USD` or `ZIG`

### 6. Verify Integration

Check that:
- [ ] Migrations applied successfully
- [ ] API endpoints return 200 status
- [ ] Payments create database records
- [ ] Frontend can call backend APIs
- [ ] Error handling works properly

## Troubleshooting

**Migration Issues:**
```powershell
# If migrations fail, try:
python manage.py migrate --fake-initial ecocash
```

**API Key Issues:**
- Ensure `.env` file is in project root
- Restart Django server after adding environment variables

**Phone Number Format:**
- Always use format: `263XXXXXXXXX`
- MulaSense auto-formats: `0774222475` → `263774222475`

## Production Deployment

For production, change:
```bash
ECOCASH_SANDBOX=False
ECOCASH_API_KEY=your-production-api-key
```

And update the endpoint in `services.py`:
```python
self.live_endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/live'
```