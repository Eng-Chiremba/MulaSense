# EcoCash API Integration Documentation

## Overview

MulaSense integrates with the official **EcoCash Open API v2** to provide seamless mobile money functionality for Zimbabwean youth. This integration replaces traditional USSD flows with modern REST API calls while maintaining USSD fallback support.

## API Configuration

### Base URL
```
https://developers.ecocash.co.zw/api/ecocash_pay/
```

### Authentication
```http
X-API-KEY: 1wddI46HBW3pK7pH32wgr3st9wIM7E4w
Content-Type: application/json
```

### Environment Variables
```bash
# Backend (.env)
ECOCASH_API_KEY=your-api-key-here
ECOCASH_SANDBOX=True  # False for production
```

## API Endpoints

### 1. Send Money (P2P Transfer)

**Endpoint:** `POST /api/v2/payment/instant/c2b/sandbox`

**MulaSense Wrapper:** `POST /api/ecocash/send-money/`

**Request:**
```json
{
  "recipient_msisdn": "263774222475",
  "amount": 10.50,
  "reason": "Payment for services",
  "currency": "USD"
}
```

**Response:**
```json
{
  "id": 1,
  "customer_msisdn": "263771234567",
  "amount": "10.50",
  "currency": "USD",
  "reason": "Send Money: Payment for services",
  "source_reference": "581af738-f459-4629-a72e-8388e0acdb5e",
  "status": "completed",
  "ecocash_transaction_id": "ECO123456789",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 2. Buy Airtime

**MulaSense Wrapper:** `POST /api/ecocash/buy-airtime/`

**Request:**
```json
{
  "phone_number": "263774222475",
  "amount": 5.00,
  "currency": "USD"
}
```

### 3. Pay Merchant

**MulaSense Wrapper:** `POST /api/ecocash/pay-merchant/`

**Request:**
```json
{
  "merchant_code": "12345",
  "amount": 25.00,
  "reason": "Grocery shopping",
  "currency": "USD"
}
```

### 4. Manual Payment

**MulaSense Wrapper:** `POST /api/ecocash/manual-payment/`

**Request:**
```json
{
  "customer_msisdn": "263774222475",
  "amount": 10.50,
  "reason": "Payment",
  "currency": "USD"
}
```

### 5. Payment History

**Endpoint:** `GET /api/ecocash/payments/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "amount": "10.50",
      "status": "completed",
      "reason": "Send Money: Payment",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 6. Payment Status Check

**Endpoint:** `GET /api/ecocash/payment-status/{source_reference}/`

### 7. Automatic Bill Payments

**List:** `GET /api/ecocash/auto-payments/`
**Create:** `POST /api/ecocash/auto-payments/`
**Update:** `PATCH /api/ecocash/auto-payments/{id}/`
**Delete:** `DELETE /api/ecocash/auto-payments/{id}/`

## Phone Number Formatting

EcoCash requires phone numbers in `263XXXXXXXXX` format:

```typescript
// Automatic formatting in MulaSense
EcoCashService.formatPhoneNumber("0774222475")   // → "263774222475"
EcoCashService.formatPhoneNumber("+263774222475") // → "263774222475"
EcoCashService.formatPhoneNumber("263774222475")  // → "263774222475"
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Payment successful |
| 400 | Bad Request | Missing required parameter |
| 401 | Unauthorized | Invalid API key |
| 402 | Request Failed | Payment failed (valid params) |
| 403 | Forbidden | API key lacks permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate request |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | EcoCash system error |

### Error Response Format

```json
{
  "error": "Bad Request - missing required parameter",
  "status_code": 400,
  "source_reference": "581af738-f459-4629-a72e-8388e0acdb5e"
}
```

## Sandbox Testing

### Test Environment
- **URL:** `/api/v2/payment/instant/c2b/sandbox`
- **API Key:** `1wddI46HBW3pK7pH32wgr3st9wIM7E4w`

### Test PIN Codes
Use these PIN codes to complete sandbox transactions:
- `"0000"`
- `"1234"`
- `"9999"`

### Test Phone Numbers
- `263774222475` - Valid test number
- `263771234567` - Alternative test number

## Frontend Integration

### TypeScript Service

```typescript
import ecocashService from '@/services/ecocash.service';

// Send money
const payment = await ecocashService.sendMoney({
  recipient_msisdn: "263774222475",
  amount: 10.50,
  reason: "Payment for services",
  currency: "USD"
});

// Buy airtime
const airtime = await ecocashService.buyAirtime({
  phone_number: "263774222475",
  amount: 5.00,
  currency: "USD"
});

// Pay merchant
const merchant = await ecocashService.payMerchant({
  merchant_code: "12345",
  amount: 25.00,
  reason: "Grocery shopping",
  currency: "USD"
});
```

### React Component Example

```tsx
import { useState } from 'react';
import ecocashService from '@/services/ecocash.service';

function SendMoneyForm() {
  const [loading, setLoading] = useState(false);
  
  const handleSendMoney = async (data: SendMoneyRequest) => {
    setLoading(true);
    try {
      const payment = await ecocashService.sendMoney(data);
      toast.success(`Payment sent! Reference: ${payment.source_reference}`);
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleSendMoney)}>
      {/* Form fields */}
    </form>
  );
}
```

## Backend Implementation

### Django Service Class

```python
class EcoCashService:
    def __init__(self):
        self.api_key = os.environ.get('ECOCASH_API_KEY')
        self.base_url = 'developers.ecocash.co.zw'
        self.is_sandbox = os.environ.get('ECOCASH_SANDBOX', 'True') == 'True'
    
    def process_payment(self, customer_msisdn, amount, reason, currency='USD'):
        payload = {
            "customerMsisdn": customer_msisdn,
            "amount": float(amount),
            "reason": reason,
            "currency": currency,
            "sourceReference": str(uuid.uuid4())
        }
        
        headers = {
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }
        
        conn = http.client.HTTPSConnection(self.base_url)
        endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/sandbox'
        conn.request("POST", endpoint, json.dumps(payload), headers)
        
        res = conn.getresponse()
        data = res.read()
        
        return {
            'success': res.status == 200,
            'status_code': res.status,
            'data': json.loads(data.decode("utf-8")) if res.status == 200 else {'error': data.decode("utf-8")},
            'source_reference': payload['sourceReference']
        }
```

### Django Views

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_money(request):
    service = EcoCashService()
    
    recipient_msisdn = request.data.get('recipient_msisdn')
    amount = request.data.get('amount')
    reason = request.data.get('reason', 'Money transfer')
    currency = request.data.get('currency', 'USD')
    
    if not recipient_msisdn or not amount:
        return Response(
            {'error': 'recipient_msisdn and amount are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = service.send_money(
            user=request.user,
            recipient_msisdn=recipient_msisdn,
            amount=amount,
            reason=reason,
            currency=currency
        )
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

## Database Models

```python
class EcoCashPayment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('ZIG', 'Zimbabwe Gold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer_msisdn = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    reason = models.CharField(max_length=255)
    source_reference = models.UUIDField(default=uuid.uuid4, unique=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # EcoCash API response data
    ecocash_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    response_data = models.JSONField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)
```

## Hybrid USSD Fallback

MulaSense implements a hybrid approach:

1. **Primary:** EcoCash REST API
2. **Fallback:** USSD execution for offline scenarios

```typescript
async executeHybridTransaction(transaction: USSDTransaction): Promise<any> {
  try {
    // Try API first
    return await this.executeEcoCashTransaction(transaction);
  } catch (apiError) {
    console.warn('API transaction failed, falling back to USSD:', apiError);
    
    // Generate USSD code and execute
    const ussdCode = this.generateUSSDCodes.sendMoney(
      transaction.recipient!, 
      transaction.amount!
    );
    
    return await this.executeUSSD(ussdCode);
  }
}
```

## Security Considerations

1. **API Key Management:** Store in environment variables, never in code
2. **Phone Number Validation:** Validate format before API calls
3. **Amount Validation:** Ensure positive values and reasonable limits
4. **Rate Limiting:** Implement request throttling
5. **Transaction Logging:** Log all transactions for audit trails
6. **Error Handling:** Don't expose sensitive error details to frontend

## Production Deployment

### Environment Setup
```bash
# Production settings
ECOCASH_API_KEY=your-production-api-key
ECOCASH_SANDBOX=False
```

### URL Changes
- Sandbox: `/api/v2/payment/instant/c2b/sandbox`
- Production: `/api/v2/payment/instant/c2b/live`

### Monitoring
- Track API response times
- Monitor error rates
- Set up alerts for failed payments
- Log transaction volumes

This integration demonstrates how modern fintech applications can leverage EcoCash's official APIs to provide seamless mobile money experiences for Zimbabwean users.