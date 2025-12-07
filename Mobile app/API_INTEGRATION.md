# API Integration Guide

## Setup

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Configure API URL
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

For production:
```
VITE_API_BASE_URL=https://your-domain.com/api
```

### 3. Start Backend Server
```bash
cd ../../MulaSense
python manage.py runserver
```

## API Service Structure

All API calls are in `src/services/api.ts`:

### Authentication
```typescript
authAPI.login(email, password)
authAPI.register(data)
authAPI.logout()
```

### Transactions
```typescript
transactionAPI.getAll()
transactionAPI.create(data)
transactionAPI.update(id, data)
transactionAPI.delete(id)
```

### Budget
```typescript
budgetAPI.getCategories()
budgetAPI.createCategory(data)
budgetAPI.updateCategory(id, data)
```

### Goals
```typescript
goalAPI.getAll()
goalAPI.create(data)
goalAPI.update(id, data)
goalAPI.contribute(id, amount)
```

### Reports
```typescript
reportAPI.getDashboard()
reportAPI.getMonthly(month, year)
reportAPI.getProfitLoss(startDate, endDate)
```

### AI
```typescript
aiAPI.chat(message)
aiAPI.getInsights()
```

### Business
```typescript
businessAPI.getCreditLimit()
businessAPI.applyCredit()
businessAPI.calculateTax(year)
```

## Usage Example

```typescript
import { transactionAPI } from '@/services/api';

const MyComponent = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await transactionAPI.getAll();
        setTransactions(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
};
```

## Authentication Flow

1. User logs in → Token stored in localStorage
2. Token automatically added to all requests via interceptor
3. If 401 error → User redirected to login

## Error Handling

All API errors are caught and handled:
- 401: Redirect to login
- Other errors: Display toast notification

## CORS Configuration

Backend must allow frontend origin:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative
]
```

## Testing API Connection

```bash
# Test backend is running
curl http://localhost:8000/api/

# Test login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Connected Pages

- ✅ Login - authAPI.login()
- ✅ Dashboard - reportAPI.getDashboard(), transactionAPI.getAll()
- 🔄 Transactions - transactionAPI.*
- 🔄 Budget - budgetAPI.*
- 🔄 Goals - goalAPI.*
- 🔄 Reports - reportAPI.*
- 🔄 AI Chat - aiAPI.chat()
- 🔄 Business - businessAPI.*

## Next Steps

1. Run `npm install` to install axios
2. Create `.env` file with API URL
3. Start backend server
4. Test login functionality
5. Connect remaining pages to API
