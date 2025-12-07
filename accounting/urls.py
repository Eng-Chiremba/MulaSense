from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # Transactions
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.TransactionDetailView.as_view(), name='transaction-detail'),
    path('transactions/add/', views.add_transaction, name='add-transaction'),
    path('transactions/recent/', views.recent_transactions, name='recent-transactions'),
    
    # Income/Expense Tracking
    path('summary/', views.income_expense_summary, name='income-expense-summary'),
    path('expenses/by-category/', views.expense_by_category, name='expense-by-category'),
    path('income/by-category/', views.income_by_category, name='income-by-category'),
    
    # Financial Reports
    path('reports/profit-loss/', views.profit_loss_report, name='profit-loss-report'),
    path('reports/cash-flow/', views.cash_flow_report, name='cash-flow-report'),
    path('reports/monthly-summary/', views.monthly_summary_report, name='monthly-summary-report'),
    path('reports/expense-analysis/', views.expense_analysis_report, name='expense-analysis-report'),
    
    # Dashboard
    path('dashboard/', views.dashboard_data, name='dashboard-data'),
    path('reports/monthly-excel/', views.generate_monthly_report, name='monthly-excel-report'),
]