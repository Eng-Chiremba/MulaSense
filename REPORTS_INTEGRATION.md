# Reports Backend-Frontend Integration

## Overview
This document describes the integration between the Django reports backend and the React frontend for the MulaSense financial management application.

## Backend Endpoints

### Base URL
All reports endpoints are available at: `http://localhost:8000/api/reports/`

### Available Endpoints

#### 1. Dashboard Overview
- **Endpoint**: `GET /api/reports/dashboard/`
- **Authentication**: Required (Token)
- **Response**:
```json
{
  "financial_summary": {
    "monthly_income": 5000.00,
    "monthly_expenses": 3500.00,
    "balance": 1500.00,
    "savings_rate": 30.0
  },
  "budget_performance": {
    "total_categories": 8,
    "over_budget": 2,
    "categories": [
      {
        "name": "Food & Dining",
        "percentage_used": 85.5,
        "status": "on_track"
      }
    ]
  },
  "goals_summary": {
    "total_goals": 3,
    "on_track": 2,
    "goals": [
      {
        "name": "Emergency Fund",
        "progress": 65.5,
        "days_remaining": 45
      }
    ]
  },
  "recent_activity": [
    {
      "description": "Grocery shopping",
      "amount": 150.00,
      "type": "expense",
      "date": "2024-01-15",
      "category": "Food & Dining"
    }
  ]
}
```

#### 2. Financial Metrics
- **Endpoint**: `GET /api/reports/metrics/?period={week|month|year}`
- **Authentication**: Required (Token)
- **Query Parameters**:
  - `period`: Time period for metrics (default: month)
- **Response**:
```json
{
  "period": "month",
  "expense_categories": [
    {
      "category__name": "Food & Dining",
      "category__color": "#FF6B6B",
      "total": 850.00
    }
  ],
  "income_categories": [
    {
      "category__name": "Salary",
      "category__color": "#4ECDC4",
      "total": 5000.00
    }
  ],
  "trends": {
    "expense_change": -12.5,
    "direction": "down"
  }
}
```

#### 3. Export Transactions (CSV)
- **Endpoint**: `GET /api/reports/export/transactions/csv/`
- **Authentication**: Required (Token)
- **Query Parameters**:
  - `start_date`: Start date (YYYY-MM-DD) - optional
  - `end_date`: End date (YYYY-MM-DD) - optional
- **Response**: CSV file download

#### 4. Export Budget (CSV)
- **Endpoint**: `GET /api/reports/export/budget/csv/`
- **Authentication**: Required (Token)
- **Response**: CSV file download

#### 5. Export Financial Report (PDF)
- **Endpoint**: `GET /api/reports/export/report/pdf/`
- **Authentication**: Required (Token)
- **Query Parameters**:
  - `start_date`: Start date (YYYY-MM-DD) - optional
  - `end_date`: End date (YYYY-MM-DD) - optional
- **Response**: PDF file download

#### 6. Export Balance Sheet (Excel)
- **Endpoint**: `GET /api/reports/export/balance-sheet/excel/`
- **Authentication**: Required (Token)
- **Response**: Excel file download

## Frontend Integration

### API Service (`src/services/api.ts`)

```typescript
export const reportAPI = {
  getDashboard: () => api.get('/reports/dashboard/'),
  
  getMetrics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get(`/reports/metrics/?period=${period}`),
  
  exportTransactionsCSV: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get(`/reports/export/transactions/csv/?${params}`, { responseType: 'blob' });
  },
  
  exportBudgetCSV: () =>
    api.get('/reports/export/budget/csv/', { responseType: 'blob' }),
  
  exportReportPDF: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get(`/reports/export/report/pdf/?${params}`, { responseType: 'blob' });
  },
  
  exportBalanceSheetExcel: () =>
    api.get('/reports/export/balance-sheet/excel/', { responseType: 'blob' }),
};
```

### Components

#### Reports Page (`src/pages/Reports.tsx`)
Main reports page that displays:
- Financial summary with income, expenses, and savings rate
- Period selector (week, month, year)
- Category breakdown with visual charts
- Export buttons for CSV, PDF, and Excel
- Budget performance metrics
- Goals progress tracking
- Recent activity feed

#### ReportsDashboard Component (`src/components/features/ReportsDashboard.tsx`)
Reusable component that displays:
- Budget performance with category status
- Goals progress with completion percentages
- Recent transaction activity

### Utilities

#### Download Helper (`src/lib/downloadHelper.ts`)
Utility functions for handling file downloads:
- `downloadFile(blob, filename)`: Downloads a blob as a file
- `getFileExtension(filename)`: Extracts file extension
- `formatFileSize(bytes)`: Formats file size for display

## Usage Examples

### Fetching Dashboard Data
```typescript
const fetchDashboard = async () => {
  try {
    const response = await reportAPI.getDashboard();
    setDashboardData(response.data);
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
  }
};
```

### Exporting Reports
```typescript
const exportReport = async () => {
  try {
    const response = await reportAPI.exportTransactionsCSV();
    downloadFile(new Blob([response.data]), 'transactions.csv');
    toast({ title: 'Success', description: 'Report exported' });
  } catch (error) {
    toast({ title: 'Error', description: 'Export failed', variant: 'destructive' });
  }
};
```

### Period-based Metrics
```typescript
const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

useEffect(() => {
  const fetchMetrics = async () => {
    const response = await reportAPI.getMetrics(period);
    setMetricsData(response.data);
  };
  fetchMetrics();
}, [period]);
```

## Features

### 1. Real-time Financial Metrics
- Monthly income and expense tracking
- Net balance calculation
- Savings rate percentage
- Period comparison (week, month, year)

### 2. Budget Performance Tracking
- Category-wise budget adherence
- Over-budget alerts
- Visual progress indicators
- Percentage utilization

### 3. Goals Management
- Active goals tracking
- Progress percentage
- Days remaining calculation
- On-track status

### 4. Export Functionality
- CSV export for transactions and budgets
- PDF financial reports with summaries
- Excel balance sheets with formatting
- Date range filtering for exports

### 5. Visual Analytics
- Category breakdown charts
- Spending trends
- Income vs expense comparison
- Color-coded status indicators

## Testing

### Backend Testing
```bash
# Test dashboard endpoint
curl -H "Authorization: Token YOUR_TOKEN" http://localhost:8000/api/reports/dashboard/

# Test metrics endpoint
curl -H "Authorization: Token YOUR_TOKEN" http://localhost:8000/api/reports/metrics/?period=month

# Test CSV export
curl -H "Authorization: Token YOUR_TOKEN" http://localhost:8000/api/reports/export/transactions/csv/ -o transactions.csv
```

### Frontend Testing
1. Navigate to `/reports` page
2. Verify dashboard data loads correctly
3. Test period selector (week, month, year)
4. Click export buttons and verify downloads
5. Check category breakdown displays properly
6. Verify budget performance metrics
7. Test goals progress tracking

## Error Handling

### Backend
- Returns 401 for unauthorized requests
- Returns 500 for server errors
- Handles missing data gracefully with default values

### Frontend
- Displays loading states during data fetch
- Shows error toasts for failed requests
- Provides fallback UI for missing data
- Handles blob download errors

## Performance Considerations

1. **Caching**: Dashboard data is fetched on mount and period change
2. **Lazy Loading**: Reports are loaded only when needed
3. **Optimized Queries**: Backend uses aggregation for efficient data retrieval
4. **Blob Handling**: Files are downloaded directly without storing in memory

## Future Enhancements

1. **Custom Date Ranges**: Allow users to select custom date ranges
2. **Scheduled Reports**: Email reports on a schedule
3. **Advanced Filters**: Filter by category, type, status
4. **Chart Visualizations**: Add interactive charts and graphs
5. **Comparison Reports**: Compare multiple periods side-by-side
6. **Report Templates**: Customizable report templates
7. **Sharing**: Share reports with team members
8. **Automated Insights**: AI-powered financial insights

## Troubleshooting

### Issue: Dashboard not loading
- Check authentication token is valid
- Verify backend server is running
- Check browser console for errors
- Ensure CORS is configured correctly

### Issue: Export not working
- Verify `responseType: 'blob'` is set in API call
- Check file download permissions
- Ensure backend has required libraries (reportlab, openpyxl)
- Check browser download settings

### Issue: Metrics not updating
- Verify period parameter is being passed correctly
- Check if transactions exist for the selected period
- Ensure date filters are working properly
- Verify backend calculations are correct

## Dependencies

### Backend
- Django REST Framework
- reportlab (PDF generation)
- openpyxl (Excel generation)
- Python CSV module

### Frontend
- React
- Axios
- React Router
- Lucide React (icons)
- Tailwind CSS
- shadcn/ui components

## Conclusion

The reports integration provides a comprehensive financial analytics and reporting system that connects the Django backend with the React frontend. It offers real-time metrics, visual analytics, and flexible export options to help users understand and manage their finances effectively.
