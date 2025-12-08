# 📊 MulaSense Reports Integration

> Complete backend-frontend integration for financial reports, analytics, and exports

## 🎯 Overview

This integration connects the Django reports backend with the React frontend, providing comprehensive financial analytics, budget tracking, goal monitoring, and flexible export options.

## ✨ Features

### 📈 Financial Analytics
- Real-time income and expense tracking
- Net balance calculation with savings rate
- Period-based analysis (week, month, year)
- Trend comparison with previous periods
- Category-wise spending breakdown

### 💰 Budget Performance
- Category budget tracking
- Over-budget alerts
- Percentage utilization
- Visual status indicators
- Top 5 categories display

### 🎯 Goals Tracking
- Active goals monitoring
- Progress percentage
- Days remaining countdown
- On-track status indicators
- Visual progress bars

### 📤 Export Functionality
- **CSV**: Transaction and budget data
- **PDF**: Comprehensive financial reports
- **Excel**: Formatted balance sheets
- Date range filtering
- Automatic filename generation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Django 4.0+
- React 18+

### Backend Setup
```bash
cd MulaSense
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd "Mobile app"
npm install
npm run dev
```

### Access Reports
Navigate to: `http://localhost:5173/reports`

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [REPORTS_INTEGRATION.md](./REPORTS_INTEGRATION.md) | Complete integration documentation |
| [REPORTS_QUICK_START.md](./REPORTS_QUICK_START.md) | Quick start guide for developers |
| [REPORTS_TESTING_GUIDE.md](./REPORTS_TESTING_GUIDE.md) | Comprehensive testing guide |
| [REPORTS_ARCHITECTURE.md](./REPORTS_ARCHITECTURE.md) | System architecture and diagrams |
| [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) | Summary of work completed |

## 🔌 API Endpoints

### Dashboard Overview
```http
GET /api/reports/dashboard/
Authorization: Token {your-token}
```

### Financial Metrics
```http
GET /api/reports/metrics/?period={week|month|year}
Authorization: Token {your-token}
```

### Export Transactions (CSV)
```http
GET /api/reports/export/transactions/csv/
Authorization: Token {your-token}
```

### Export Report (PDF)
```http
GET /api/reports/export/report/pdf/
Authorization: Token {your-token}
```

### Export Balance Sheet (Excel)
```http
GET /api/reports/export/balance-sheet/excel/
Authorization: Token {your-token}
```

## 💻 Usage Examples

### Fetch Dashboard Data
```typescript
import { reportAPI } from '@/services/api';

const fetchDashboard = async () => {
  const response = await reportAPI.getDashboard();
  console.log(response.data.financial_summary);
};
```

### Export Report
```typescript
import { reportAPI } from '@/services/api';
import { downloadFile } from '@/lib/downloadHelper';

const exportCSV = async () => {
  const response = await reportAPI.exportTransactionsCSV();
  downloadFile(new Blob([response.data]), 'transactions.csv');
};
```

### Use Dashboard Component
```tsx
import { ReportsDashboard } from '@/components/features/ReportsDashboard';

function MyPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    reportAPI.getDashboard().then(res => setData(res.data));
  }, []);
  
  return <ReportsDashboard dashboardData={data} />;
}
```

## 🗂️ Project Structure

```
MulaSense/
├── reports/                          # Django Reports App
│   ├── views.py                      # API endpoints
│   ├── urls.py                       # URL routing
│   └── serializers.py                # Serializers
│
└── Mobile app/
    └── src/
        ├── services/
        │   └── api.ts                # API client
        ├── pages/
        │   └── Reports.tsx           # Reports page
        ├── components/features/
        │   └── ReportsDashboard.tsx  # Dashboard component
        └── lib/
            └── downloadHelper.ts     # Download utilities
```

## 🧪 Testing

### Run Backend Tests
```bash
python manage.py test reports
```

### Test API Endpoints
```bash
# Dashboard
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/dashboard/

# Metrics
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/metrics/?period=month

# Export CSV
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/export/transactions/csv/ \
  -o transactions.csv
```

### Frontend Testing
1. Navigate to `/reports`
2. Verify data loads correctly
3. Test period selector
4. Test export buttons
5. Check responsive design

See [REPORTS_TESTING_GUIDE.md](./REPORTS_TESTING_GUIDE.md) for detailed test cases.

## 🎨 Components

### Reports Page
Main page displaying financial analytics and reports.

**Location**: `src/pages/Reports.tsx`

**Features**:
- Financial summary card
- Period selector
- Category breakdown
- Export buttons
- Dashboard insights

### ReportsDashboard Component
Reusable component for displaying budget, goals, and activity.

**Location**: `src/components/features/ReportsDashboard.tsx`

**Props**:
```typescript
interface ReportsDashboardProps {
  dashboardData: any;
  className?: string;
}
```

## 🔧 Configuration

### Backend Settings
Ensure these are in `settings.py`:
```python
INSTALLED_APPS = [
    # ...
    'reports',
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Frontend Environment
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📊 Data Models

### Financial Summary
```typescript
{
  monthly_income: number;
  monthly_expenses: number;
  balance: number;
  savings_rate: number;
}
```

### Budget Performance
```typescript
{
  total_categories: number;
  over_budget: number;
  categories: Array<{
    name: string;
    percentage_used: number;
    status: 'on_track' | 'over';
  }>;
}
```

### Goals Summary
```typescript
{
  total_goals: number;
  on_track: number;
  goals: Array<{
    name: string;
    progress: number;
    days_remaining: number;
  }>;
}
```

## 🐛 Troubleshooting

### Dashboard not loading
- Check backend is running: `python manage.py runserver`
- Verify authentication token is valid
- Check browser console for errors

### Export not working
- Ensure `responseType: 'blob'` is set
- Check backend has required libraries: `pip install reportlab openpyxl`
- Verify browser download settings

### No data showing
- Add test transactions and budgets
- Check date filters
- Verify user authentication

See [REPORTS_TESTING_GUIDE.md](./REPORTS_TESTING_GUIDE.md) for more solutions.

## 🚀 Performance

### Benchmarks
- Dashboard load: < 2 seconds
- Period change: < 1 second
- Export generation: < 3 seconds

### Optimizations
- Parallel API requests
- Database query optimization
- Efficient aggregations
- Blob handling for exports

## 🔒 Security

- Token-based authentication
- User data isolation
- Input validation
- SQL injection protection
- CORS configuration

## 📈 Future Enhancements

- [ ] Custom date range selector
- [ ] Interactive charts and graphs
- [ ] Scheduled email reports
- [ ] Advanced filtering options
- [ ] Comparison reports
- [ ] Report templates
- [ ] AI-powered insights
- [ ] Team sharing features

## 🤝 Contributing

1. Read the documentation
2. Follow the code style
3. Write tests for new features
4. Update documentation
5. Submit pull request

## 📝 License

This project is part of MulaSense financial management system.

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review the testing guide
3. Check browser console
4. Verify backend logs

## 🎉 Acknowledgments

Built with:
- Django REST Framework
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Axios
- ReportLab (PDF)
- OpenPyXL (Excel)

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: ✅ Production Ready

For detailed information, see the complete documentation in the links above.
