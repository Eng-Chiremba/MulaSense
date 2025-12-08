# Income & Expense Summary Feature

## 📊 Overview

The Income & Expense Summary page provides a comprehensive visual and detailed analysis of user financial activity over the last 6 months.

## ✨ Features

### 1. Summary Cards
- **Total Income**: Aggregate income with monthly average
- **Total Expenses**: Aggregate expenses with monthly average
- **Net Balance**: Overall financial position with savings rate

### 2. Interactive Charts
Three chart types available:
- **Bar Chart**: Side-by-side comparison of income vs expenses
- **Line Chart**: Trend analysis over time
- **Pie Chart**: Category-wise expense breakdown

### 3. Category Breakdown
- Top 8 expense categories
- Visual pie chart with percentages
- Color-coded legend with amounts

### 4. Monthly Details
For each month:
- Income and expense amounts
- Net balance (surplus/deficit)
- Savings rate percentage
- Status indicator (surplus/deficit badge)

## 🎨 UI Components

### Summary Cards Layout
```
┌─────────────────┬─────────────────┐
│  Total Income   │ Total Expenses  │
│  $15,000        │  $10,500        │
│  Avg: $2,500/mo │  Avg: $1,750/mo │
└─────────────────┴─────────────────┘

┌───────────────────────────────────┐
│  Net Balance: $4,500              │
│  30% savings rate                 │
│  Last 6 months                    │
└───────────────────────────────────┘
```

### Chart Type Selector
```
[Bar Chart] [Line Chart] [Pie Chart]
```

### Monthly Breakdown Cards
```
┌─────────────────────────────────┐
│ Jan 2024              [Surplus] │
├─────────────────────────────────┤
│ Income:    $5,000               │
│ Expenses:  $3,500               │
├─────────────────────────────────┤
│ Net:       $1,500               │
│ Savings:   30.0%                │
└─────────────────────────────────┘
```

## 🔧 Technical Implementation

### Data Processing
```typescript
// Monthly aggregation
const monthlyData: Record<string, { income: number; expense: number }> = {};

transactions.forEach((txn) => {
  const monthKey = format(date, 'MMM yyyy');
  if (txn.transaction_type === 'income') {
    monthlyData[monthKey].income += amount;
  } else {
    monthlyData[monthKey].expense += amount;
  }
});
```

### Category Aggregation
```typescript
// Category totals for pie chart
const categoryTotals: Record<string, number> = {};

transactions.forEach((txn) => {
  if (txn.transaction_type === 'expense') {
    const category = txn.category_name || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }
});
```

### Chart Rendering
```typescript
// Bar Chart
<BarChart data={chartData}>
  <Bar dataKey="Income" fill="#10B981" />
  <Bar dataKey="Expenses" fill="#EF4444" />
</BarChart>

// Line Chart
<LineChart data={chartData}>
  <Line dataKey="Income" stroke="#10B981" />
  <Line dataKey="Expenses" stroke="#EF4444" />
</LineChart>

// Pie Chart
<PieChart>
  <Pie data={categoryData} dataKey="value" />
</PieChart>
```

## 📱 User Flow

1. User navigates to Reports page
2. Clicks "Income & Expense Summary" button
3. Page loads with summary cards
4. User can switch between chart types
5. Scrolls down to see monthly breakdown
6. Reviews detailed metrics for each month

## 🎯 Key Metrics Displayed

### Overall Metrics
- Total Income (6 months)
- Total Expenses (6 months)
- Average Monthly Income
- Average Monthly Expenses
- Net Balance
- Overall Savings Rate

### Monthly Metrics
- Monthly Income
- Monthly Expenses
- Monthly Net Balance
- Monthly Savings Rate
- Surplus/Deficit Status

### Category Metrics
- Top 8 Expense Categories
- Amount per Category
- Percentage of Total Expenses

## 🎨 Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Income | Green | #10B981 |
| Expenses | Red | #EF4444 |
| Net Positive | Blue | #3B82F6 |
| Net Negative | Orange | #F97316 |
| Category 1 | Green | #10B981 |
| Category 2 | Blue | #3B82F6 |
| Category 3 | Amber | #F59E0B |
| Category 4 | Red | #EF4444 |
| Category 5 | Purple | #8B5CF6 |
| Category 6 | Pink | #EC4899 |
| Category 7 | Teal | #14B8A6 |
| Category 8 | Orange | #F97316 |

## 📊 Chart Types

### Bar Chart
- **Best for**: Comparing income vs expenses side-by-side
- **Shows**: Monthly comparison
- **Interactive**: Hover for exact values

### Line Chart
- **Best for**: Viewing trends over time
- **Shows**: Income and expense trends
- **Interactive**: Hover for exact values

### Pie Chart
- **Best for**: Understanding expense distribution
- **Shows**: Category breakdown
- **Interactive**: Hover for percentages

## 🚀 Usage

### Navigate to Summary
```typescript
// From Reports page
navigate('/reports/income-expense');
```

### Switch Chart Types
```typescript
const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

<Button onClick={() => setChartType('bar')}>Bar Chart</Button>
<Button onClick={() => setChartType('line')}>Line Chart</Button>
<Button onClick={() => setChartType('pie')}>Pie Chart</Button>
```

## 💡 Insights Provided

### Financial Health
- Positive net balance indicates good financial health
- High savings rate shows effective money management
- Consistent income shows financial stability

### Spending Patterns
- Category breakdown reveals spending priorities
- Monthly trends show seasonal variations
- Expense patterns help identify areas to optimize

### Budget Planning
- Average monthly expenses help set realistic budgets
- Income trends inform future financial planning
- Category data guides budget allocation

## 🔄 Data Updates

- Data refreshes on page load
- Automatically includes last 6 months
- Updates when new transactions are added
- Real-time calculation of all metrics

## 📈 Performance

- Efficient data aggregation
- Optimized chart rendering
- Smooth chart type transitions
- Responsive design for all devices

## 🎯 Future Enhancements

- [ ] Custom date range selector
- [ ] Export summary as PDF
- [ ] Compare with previous periods
- [ ] Budget vs actual comparison
- [ ] Predictive analytics
- [ ] Goal progress integration
- [ ] Category drill-down
- [ ] Yearly summary view

## 🐛 Troubleshooting

### No data showing
- Ensure transactions exist in database
- Check transaction status is 'completed'
- Verify date range includes transactions

### Charts not rendering
- Check recharts library is installed
- Verify data format is correct
- Check browser console for errors

### Incorrect calculations
- Verify transaction amounts are numbers
- Check transaction types are correct
- Ensure category names are populated

## ✅ Testing Checklist

- [ ] Summary cards display correct totals
- [ ] Average calculations are accurate
- [ ] Bar chart renders properly
- [ ] Line chart shows trends
- [ ] Pie chart displays categories
- [ ] Chart switching works smoothly
- [ ] Monthly details are accurate
- [ ] Savings rate calculates correctly
- [ ] Surplus/deficit badges show correctly
- [ ] Responsive on mobile devices
- [ ] Loading state displays
- [ ] Empty state shows when no data

## 📝 Code Location

**File**: `Mobile app/src/pages/IncomeExpenseReport.tsx`

**Key Functions**:
- `fetchData()`: Loads and processes transaction data
- `setChartType()`: Switches between chart types
- Chart rendering logic for each type

**Dependencies**:
- recharts: Chart library
- date-fns: Date formatting
- lucide-react: Icons
- shadcn/ui: UI components

---

**Status**: ✅ Complete  
**Version**: 1.0.0  
**Last Updated**: January 2024
