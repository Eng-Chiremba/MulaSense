# Reports Integration - Quick Start Guide

## 🚀 Quick Setup

### 1. Backend Setup
```bash
# Ensure reports app is in INSTALLED_APPS (already done)
# URLs are already configured in MulaSense/urls.py
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd "Mobile app"
npm install
npm run dev
```

## 📊 Using Reports in Your App

### Basic Dashboard Data
```typescript
import { reportAPI } from '@/services/api';

// Fetch dashboard overview
const data = await reportAPI.getDashboard();
console.log(data.financial_summary);
console.log(data.budget_performance);
console.log(data.goals_summary);
```

### Period-based Metrics
```typescript
// Get weekly metrics
const weeklyData = await reportAPI.getMetrics('week');

// Get monthly metrics (default)
const monthlyData = await reportAPI.getMetrics('month');

// Get yearly metrics
const yearlyData = await reportAPI.getMetrics('year');
```

### Export Reports
```typescript
import { downloadFile } from '@/lib/downloadHelper';

// Export transactions as CSV
const csvResponse = await reportAPI.exportTransactionsCSV();
downloadFile(new Blob([csvResponse.data]), 'transactions.csv');

// Export financial report as PDF
const pdfResponse = await reportAPI.exportReportPDF();
downloadFile(new Blob([pdfResponse.data]), 'report.pdf');

// Export balance sheet as Excel
const excelResponse = await reportAPI.exportBalanceSheetExcel();
downloadFile(new Blob([excelResponse.data]), 'balance_sheet.xlsx');
```

## 🎨 Using Components

### ReportsDashboard Component
```tsx
import { ReportsDashboard } from '@/components/features/ReportsDashboard';

function MyPage() {
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    reportAPI.getDashboard().then(res => setDashboardData(res.data));
  }, []);
  
  return <ReportsDashboard dashboardData={dashboardData} />;
}
```

## 🔧 Common Patterns

### Loading State
```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await reportAPI.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <div>Loading...</div>;
```

### Error Handling with Toast
```typescript
import { toast } from '@/hooks/use-toast';

try {
  const response = await reportAPI.exportTransactionsCSV();
  downloadFile(new Blob([response.data]), 'transactions.csv');
  toast({
    title: 'Success',
    description: 'Report exported successfully',
  });
} catch (error) {
  toast({
    title: 'Error',
    description: 'Failed to export report',
    variant: 'destructive',
  });
}
```

## 📁 File Structure

```
MulaSense/
├── reports/                          # Backend reports app
│   ├── views.py                      # API endpoints
│   ├── urls.py                       # URL routing
│   └── serializers.py                # Data serialization
│
└── Mobile app/
    ├── src/
    │   ├── services/
    │   │   └── api.ts                # API client with reportAPI
    │   ├── components/features/
    │   │   └── ReportsDashboard.tsx  # Dashboard component
    │   ├── pages/
    │   │   └── Reports.tsx           # Main reports page
    │   └── lib/
    │       └── downloadHelper.ts     # File download utilities
    │
    └── REPORTS_INTEGRATION.md        # Full documentation
```

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/reports/dashboard/` | GET | Dashboard overview |
| `/api/reports/metrics/` | GET | Financial metrics |
| `/api/reports/export/transactions/csv/` | GET | Export transactions |
| `/api/reports/export/budget/csv/` | GET | Export budget |
| `/api/reports/export/report/pdf/` | GET | Export PDF report |
| `/api/reports/export/balance-sheet/excel/` | GET | Export balance sheet |

## 💡 Tips

1. **Always use `responseType: 'blob'`** for export endpoints
2. **Add date to filenames** for better organization
3. **Show loading states** during data fetches
4. **Handle errors gracefully** with user-friendly messages
5. **Cache dashboard data** to reduce API calls
6. **Use period selector** for flexible time ranges

## 🐛 Debugging

### Check if backend is running
```bash
curl http://localhost:8000/api/reports/dashboard/
```

### Check authentication
```bash
curl -H "Authorization: Token YOUR_TOKEN" http://localhost:8000/api/reports/dashboard/
```

### View network requests
Open browser DevTools → Network tab → Filter by "reports"

### Check console logs
```typescript
console.log('Dashboard data:', dashboardData);
console.log('Metrics data:', metricsData);
```

## ✅ Testing Checklist

- [ ] Dashboard loads with correct data
- [ ] Period selector changes metrics
- [ ] CSV export downloads file
- [ ] PDF export downloads file
- [ ] Excel export downloads file
- [ ] Budget performance displays correctly
- [ ] Goals progress shows accurate data
- [ ] Recent activity lists transactions
- [ ] Error messages display on failures
- [ ] Loading states show during fetches

## 🚨 Common Issues

**Issue**: "Failed to fetch dashboard"
- **Solution**: Check if backend is running and token is valid

**Issue**: "Export not downloading"
- **Solution**: Ensure `responseType: 'blob'` is set in API call

**Issue**: "No data showing"
- **Solution**: Add some transactions and budgets first

**Issue**: "CORS error"
- **Solution**: Check Django CORS settings in settings.py

## 📚 Next Steps

1. Read full documentation: `REPORTS_INTEGRATION.md`
2. Explore the Reports page: Navigate to `/reports`
3. Test export functionality
4. Customize dashboard components
5. Add custom metrics and charts

## 🤝 Need Help?

- Check the full documentation
- Review the code examples
- Test with sample data
- Check browser console for errors
- Verify backend logs for issues
