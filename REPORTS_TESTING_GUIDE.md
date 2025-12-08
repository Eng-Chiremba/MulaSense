# Reports Integration Testing Guide

## 🧪 Pre-Testing Setup

### 1. Start Backend Server
```bash
cd MulaSense
python manage.py runserver
```

### 2. Start Frontend Server
```bash
cd "Mobile app"
npm run dev
```

### 3. Ensure You Have Test Data
- At least 5-10 transactions (income and expense)
- 2-3 budget categories
- 1-2 active goals
- User account with authentication token

## 📋 Test Cases

### Test 1: Dashboard Data Loading
**Objective**: Verify dashboard loads with correct data

**Steps**:
1. Navigate to `http://localhost:5173/reports`
2. Wait for page to load
3. Verify loading state appears briefly
4. Check that data populates

**Expected Results**:
- ✅ Loading spinner/text appears
- ✅ Financial summary shows income, expenses, balance
- ✅ Savings rate displays as percentage
- ✅ No error messages appear

**Pass/Fail**: ___________

---

### Test 2: Period Selector
**Objective**: Verify period selector changes metrics

**Steps**:
1. On Reports page, note current metrics
2. Click "Week" button
3. Observe data changes
4. Click "Year" button
5. Observe data changes
6. Click "Month" button to return

**Expected Results**:
- ✅ Week button shows weekly data
- ✅ Year button shows yearly data
- ✅ Month button shows monthly data
- ✅ Active button is highlighted
- ✅ Data updates without page reload

**Pass/Fail**: ___________

---

### Test 3: CSV Export
**Objective**: Verify CSV export downloads correctly

**Steps**:
1. Click the table icon (CSV export button)
2. Wait for download to complete
3. Open downloaded CSV file
4. Verify data format

**Expected Results**:
- ✅ File downloads automatically
- ✅ Filename includes date (e.g., `transactions_2024-01-15.csv`)
- ✅ CSV contains transaction data
- ✅ Headers are present (Date, Description, Category, Type, Amount, Status)
- ✅ Data is properly formatted
- ✅ Success toast notification appears

**Pass/Fail**: ___________

---

### Test 4: PDF Export
**Objective**: Verify PDF export generates correctly

**Steps**:
1. Click the document icon (PDF export button)
2. Wait for download to complete
3. Open downloaded PDF file
4. Verify content

**Expected Results**:
- ✅ PDF downloads automatically
- ✅ Filename includes date (e.g., `financial_report_2024-01-15.pdf`)
- ✅ PDF opens without errors
- ✅ Contains financial summary
- ✅ Shows income and expenses
- ✅ Lists category breakdown
- ✅ Success toast notification appears

**Pass/Fail**: ___________

---

### Test 5: Excel Export
**Objective**: Verify Excel export creates formatted spreadsheet

**Steps**:
1. Click the download icon (Excel export button)
2. Wait for download to complete
3. Open downloaded Excel file
4. Verify formatting

**Expected Results**:
- ✅ Excel file downloads automatically
- ✅ Filename includes date (e.g., `balance_sheet_2024-01-15.xlsx`)
- ✅ File opens in Excel/spreadsheet app
- ✅ Contains balance sheet data
- ✅ Headers are bold
- ✅ Numbers are formatted as currency
- ✅ Columns are properly sized
- ✅ Success toast notification appears

**Pass/Fail**: ___________

---

### Test 6: Budget Performance Display
**Objective**: Verify budget performance section shows correctly

**Steps**:
1. Scroll to "Budget Performance" section
2. Verify data displays
3. Check status indicators

**Expected Results**:
- ✅ Total categories count is correct
- ✅ Over budget count is accurate
- ✅ Categories list shows up to 5 items
- ✅ Percentage used is displayed
- ✅ Status icons show (✓ for on track, ⚠ for over)
- ✅ Colors match status (green for good, red for over)

**Pass/Fail**: ___________

---

### Test 7: Goals Progress Display
**Objective**: Verify goals section displays correctly

**Steps**:
1. Scroll to "Goals Progress" section
2. Verify goal data
3. Check progress bars

**Expected Results**:
- ✅ Total goals count is correct
- ✅ On track count is accurate
- ✅ Goals list shows up to 3 items
- ✅ Progress percentage is displayed
- ✅ Days remaining is shown
- ✅ Progress bars fill correctly
- ✅ Progress bars are color-coded

**Pass/Fail**: ___________

---

### Test 8: Recent Activity Feed
**Objective**: Verify recent activity displays transactions

**Steps**:
1. Scroll to "Recent Activity" section
2. Verify transaction list
3. Check transaction details

**Expected Results**:
- ✅ Shows recent transactions
- ✅ Transaction descriptions are visible
- ✅ Amounts are displayed correctly
- ✅ Income shows with + and green color
- ✅ Expenses show with - and red color
- ✅ Categories are listed
- ✅ Dates are formatted properly

**Pass/Fail**: ___________

---

### Test 9: Category Breakdown
**Objective**: Verify category breakdown displays correctly

**Steps**:
1. Scroll to "Top Spending Categories" section
2. Verify category data
3. Check visual bars

**Expected Results**:
- ✅ Shows top 4 categories
- ✅ Category names are displayed
- ✅ Amounts are shown
- ✅ Percentages are calculated correctly
- ✅ Progress bars fill proportionally
- ✅ Colors are consistent
- ✅ Bars animate on load

**Pass/Fail**: ___________

---

### Test 10: Error Handling
**Objective**: Verify error handling works correctly

**Steps**:
1. Stop backend server
2. Refresh Reports page
3. Observe error handling
4. Try to export a report
5. Restart backend server

**Expected Results**:
- ✅ Error toast appears when data fetch fails
- ✅ Error message is user-friendly
- ✅ Page doesn't crash
- ✅ Export shows error toast
- ✅ Page recovers when backend restarts

**Pass/Fail**: ___________

---

### Test 11: Loading States
**Objective**: Verify loading states display correctly

**Steps**:
1. Clear browser cache
2. Navigate to Reports page
3. Observe loading behavior
4. Change period selector
5. Observe loading behavior

**Expected Results**:
- ✅ Loading text/spinner appears on initial load
- ✅ Loading state shows during period change
- ✅ UI doesn't flicker
- ✅ Data updates smoothly
- ✅ Loading state clears when data loads

**Pass/Fail**: ___________

---

### Test 12: Responsive Design
**Objective**: Verify page works on different screen sizes

**Steps**:
1. Open Reports page on desktop
2. Resize browser to tablet size
3. Resize to mobile size
4. Test all features at each size

**Expected Results**:
- ✅ Layout adapts to screen size
- ✅ All content is readable
- ✅ Buttons are clickable
- ✅ Export buttons are accessible
- ✅ No horizontal scrolling
- ✅ Cards stack properly on mobile

**Pass/Fail**: ___________

---

## 🔍 Backend API Testing

### Test API Endpoints Directly

#### Test 1: Dashboard Endpoint
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/dashboard/
```

**Expected**: JSON with financial_summary, budget_performance, goals_summary, recent_activity

---

#### Test 2: Metrics Endpoint
```bash
# Monthly metrics
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/metrics/?period=month

# Weekly metrics
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/metrics/?period=week

# Yearly metrics
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/metrics/?period=year
```

**Expected**: JSON with period, expense_categories, income_categories, trends

---

#### Test 3: CSV Export
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/export/transactions/csv/ \
  -o transactions.csv
```

**Expected**: CSV file downloaded

---

#### Test 4: PDF Export
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/export/report/pdf/ \
  -o report.pdf
```

**Expected**: PDF file downloaded

---

#### Test 5: Excel Export
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/reports/export/balance-sheet/excel/ \
  -o balance_sheet.xlsx
```

**Expected**: Excel file downloaded

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch dashboard"
**Possible Causes**:
- Backend not running
- Invalid authentication token
- CORS not configured

**Solutions**:
1. Check backend is running: `python manage.py runserver`
2. Verify token in localStorage: `localStorage.getItem('token')`
3. Check Django CORS settings

---

### Issue: "Export not downloading"
**Possible Causes**:
- Missing `responseType: 'blob'` in API call
- Browser blocking downloads
- Backend missing required libraries

**Solutions**:
1. Verify `responseType: 'blob'` in api.ts
2. Check browser download settings
3. Install: `pip install reportlab openpyxl`

---

### Issue: "No data showing"
**Possible Causes**:
- No transactions in database
- Date filters excluding all data
- User not authenticated

**Solutions**:
1. Add test transactions
2. Check date range filters
3. Verify authentication token

---

### Issue: "Period selector not working"
**Possible Causes**:
- State not updating
- API not receiving period parameter
- Backend not filtering by period

**Solutions**:
1. Check React state updates
2. Verify API call includes period parameter
3. Check backend view filters by period

---

## ✅ Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Dashboard Loading | ⬜ | |
| Period Selector | ⬜ | |
| CSV Export | ⬜ | |
| PDF Export | ⬜ | |
| Excel Export | ⬜ | |
| Budget Performance | ⬜ | |
| Goals Progress | ⬜ | |
| Recent Activity | ⬜ | |
| Category Breakdown | ⬜ | |
| Error Handling | ⬜ | |
| Loading States | ⬜ | |
| Responsive Design | ⬜ | |

**Legend**: ✅ Pass | ❌ Fail | ⬜ Not Tested

---

## 📊 Performance Testing

### Load Time Benchmarks
- Dashboard initial load: < 2 seconds
- Period change: < 1 second
- Export generation: < 3 seconds

### Test with Different Data Volumes
- [ ] 10 transactions
- [ ] 100 transactions
- [ ] 1,000 transactions
- [ ] 10,000 transactions

**Notes**: _______________________________

---

## 🎯 Acceptance Criteria

All tests must pass for integration to be considered complete:

- [ ] All 12 frontend tests pass
- [ ] All 5 backend API tests pass
- [ ] No console errors
- [ ] No network errors
- [ ] All exports work correctly
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] Responsive design works
- [ ] Performance is acceptable
- [ ] Documentation is complete

---

## 📝 Test Report

**Tester Name**: _______________________________

**Date**: _______________________________

**Environment**:
- Backend: Python _____, Django _____
- Frontend: Node _____, React _____
- Browser: _______________________________

**Overall Status**: ⬜ Pass | ⬜ Fail

**Issues Found**: _______________________________
_______________________________
_______________________________

**Recommendations**: _______________________________
_______________________________
_______________________________

**Sign-off**: _______________________________
