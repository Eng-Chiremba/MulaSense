# Transfers Module

## Overview
The Transfers module handles money transfers between users, accounts, and currency exchanges in the MulaSense financial management system.

## Features

### Transfer Categories
1. **Send to Registered User** - Transfer money to another MulaSense user
2. **Send to Unregistered User** - Send money to a phone number (not registered)
3. **Send to Account** - Transfer money to a bank account
4. **USD to Zig** - Exchange USD to ZIG currency

### Key Capabilities
- Simulated transfer processing with 95% success rate
- Real-time exchange rate information
- Automatic transaction creation in accounting module
- Transfer history and tracking
- UUID-based reference numbers
- Status tracking (pending, processing, completed, failed, cancelled)

## Models

### Transfer
Main model for storing transfer information.

**Fields:**
- `reference` - Unique UUID for the transfer
- `sender` - User initiating the transfer
- `transfer_type` - Type of transfer (see categories above)
- `recipient_user` - Recipient user (if registered)
- `recipient_phone` - Recipient phone number
- `recipient_account` - Recipient account number
- `recipient_name` - Recipient name
- `amount` - Transfer amount
- `currency_from` - Source currency
- `currency_to` - Destination currency
- `exchange_rate` - Exchange rate applied
- `amount_received` - Amount received after conversion
- `description` - Transfer description
- `status` - Current status
- `transaction` - Linked accounting transaction
- `response_data` - API response data (JSON)
- `error_message` - Error message if failed
- `initiated_at` - Transfer initiation timestamp
- `completed_at` - Transfer completion timestamp

## Services

### TransferService
Handles the business logic for processing transfers.

**Methods:**
- `send_to_registered_user()` - Process transfer to registered user
- `send_to_unregistered_user()` - Process transfer to unregistered user
- `send_to_account()` - Process transfer to bank account
- `currency_exchange()` - Process currency exchange
- `_process_transfer()` - Internal method for simulating transfer processing

**Exchange Rates:**
- USD to ZIG: 13.5
- ZIG to USD: 0.074
- USD to ZWL: 13.5
- ZWL to USD: 0.074

## API Endpoints

### Public Endpoints
- `GET /api/transfers/categories/` - Get transfer categories
- `GET /api/transfers/exchange-rates/` - Get exchange rates

### Transfer Operations
- `POST /api/transfers/send-to-registered/` - Send to registered user
- `POST /api/transfers/send-to-unregistered/` - Send to unregistered user
- `POST /api/transfers/send-to-account/` - Send to account
- `POST /api/transfers/currency-exchange/` - Exchange currency

### History & Details
- `GET /api/transfers/history/` - Get transfer history
- `GET /api/transfers/detail/<reference>/` - Get transfer details
- `GET /api/transfers/transfers/` - List all transfers (paginated)

## Setup

### 1. Run Migrations
```bash
python manage.py migrate transfers
```

### 2. Setup Transfer Categories
```bash
python manage.py setup_transfer_categories
```

This creates the following categories in the accounting module:
- Send to Registered User
- Send to Unregistered User
- Send to Account
- USD to Zig
- Transfer (generic)

## Usage Examples

### Send to Registered User
```python
from transfers.services import TransferService

service = TransferService()
transfer = service.send_to_registered_user(
    sender=user,
    recipient_phone='263771234567',
    amount=50.00,
    description='Payment for services'
)
```

### Currency Exchange
```python
transfer = service.currency_exchange(
    sender=user,
    amount=100.00,
    currency_from='USD',
    currency_to='ZIG',
    description='Exchange to ZIG'
)
```

### Check Transfer Status
```python
from transfers.models import Transfer

transfer = Transfer.objects.get(reference='550e8400-e29b-41d4-a716-446655440000')
print(f"Status: {transfer.status}")
print(f"Amount: {transfer.amount}")
if transfer.status == 'completed':
    print(f"Completed at: {transfer.completed_at}")
```

## Integration with Accounting Module

When a transfer is completed successfully, the system automatically:
1. Creates a Transaction record in the accounting module
2. Links the transaction to the transfer
3. Sets the transaction category to "Transfer"
4. Records the amount and description
5. Marks the transaction as completed

## Validation

### Phone Number Validation
- Must start with "263" (Zimbabwe country code)
- Must be exactly 12 digits
- Example: 263771234567

### Amount Validation
- Must be greater than 0.01
- Maximum 12 digits with 2 decimal places

### Account Number Validation
- Maximum 50 characters
- Alphanumeric characters allowed

## Error Handling

The service simulates real-world transfer failures with a 5% failure rate. Common error messages:
- "Insufficient funds"
- "Invalid recipient"
- "Network error"

Failed transfers:
- Have status set to "failed"
- Include error_message field
- Do not create accounting transactions
- Store response_data for debugging

## Testing

### Manual Testing
Use the API endpoints to test transfers:

```bash
# Get categories
curl -H "Authorization: Token your-token" \
  http://localhost:8000/api/transfers/categories/

# Send transfer
curl -X POST \
  -H "Authorization: Token your-token" \
  -H "Content-Type: application/json" \
  -d '{"recipient_phone":"263771234567","amount":50,"description":"Test"}' \
  http://localhost:8000/api/transfers/send-to-registered/
```

## Future Enhancements

Potential improvements:
- Real payment gateway integration
- Multi-currency support
- Scheduled transfers
- Recurring transfers
- Transfer limits and daily caps
- KYC verification
- Transaction fees
- Refund functionality
- Batch transfers
- Transfer templates

## Dependencies

- Django 5.2.8
- Django REST Framework 3.15.2
- accounting module (for Transaction creation)
- users module (for User model)

## Security Considerations

- All endpoints require authentication
- Users can only view their own transfers
- Phone numbers are validated
- Amount limits can be configured
- Transfer references are UUID-based (non-guessable)
- Sensitive data is not logged

## Performance

- Database indexes on sender and status fields
- Database index on reference field
- Efficient queryset filtering
- Pagination support for large result sets

## Monitoring

Track these metrics:
- Transfer success rate
- Average processing time
- Failed transfer reasons
- Popular transfer types
- Currency exchange volume
- Daily/monthly transfer volume
