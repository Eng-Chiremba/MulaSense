from django.urls import path
from . import views

urlpatterns = [
    # Dashboard Data
    path('dashboard/', views.dashboard_overview, name='dashboard-overview'),
    path('dashboard/stats/', views.dashboard_overview, name='dashboard-stats'),
    path('metrics/', views.financial_metrics, name='financial-metrics'),
    
    # Export Functionality
    path('export/transactions/csv/', views.export_transactions_csv, name='export-transactions-csv'),
    path('export/budget/csv/', views.export_budget_csv, name='export-budget-csv'),
    path('export/report/pdf/', views.export_financial_report_pdf, name='export-report-pdf'),
    path('export/balance-sheet/excel/', views.export_balance_sheet_excel, name='export-balance-sheet-excel'),
]