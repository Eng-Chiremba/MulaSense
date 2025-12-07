from django.db.models import Sum, Avg
from django.utils import timezone
from datetime import timedelta
from .models import Transaction

def calculate_credit_eligibility(user):
    """
    Analyze user's income flow and determine credit eligibility
    """
    now = timezone.now()
    
    # Last 3 months data
    three_months_ago = now - timedelta(days=90)
    
    transactions = Transaction.objects.filter(
        user=user,
        transaction_date__gte=three_months_ago,
        status='completed'
    )
    
    # Monthly income analysis
    monthly_income = transactions.filter(
        transaction_type='income'
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    avg_monthly_income = monthly_income / 3
    
    # Monthly expenses analysis
    monthly_expenses = transactions.filter(
        transaction_type='expense'
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    avg_monthly_expenses = monthly_expenses / 3
    
    # Calculate disposable income
    disposable_income = avg_monthly_income - avg_monthly_expenses
    
    # Debt-to-Income ratio (assuming 30% is safe)
    safe_monthly_payment = avg_monthly_income * 0.30
    
    # Credit limit calculation
    # Base: 2x monthly disposable income
    # Max: 5x monthly income
    # Min: $500
    
    base_credit = disposable_income * 2
    max_credit = avg_monthly_income * 5
    min_credit = 500
    
    credit_limit = max(min(base_credit, max_credit), min_credit)
    
    # Risk assessment
    if disposable_income < 0:
        risk_level = 'high'
        approval_status = 'denied'
    elif disposable_income < avg_monthly_income * 0.1:
        risk_level = 'medium-high'
        approval_status = 'review'
    elif disposable_income < avg_monthly_income * 0.3:
        risk_level = 'medium'
        approval_status = 'approved'
    else:
        risk_level = 'low'
        approval_status = 'approved'
    
    # Interest rate based on risk
    interest_rates = {
        'low': 8.5,
        'medium': 12.0,
        'medium-high': 15.5,
        'high': 18.0
    }
    
    return {
        'credit_limit': round(credit_limit, 2),
        'monthly_income': round(avg_monthly_income, 2),
        'monthly_expenses': round(avg_monthly_expenses, 2),
        'disposable_income': round(disposable_income, 2),
        'safe_monthly_payment': round(safe_monthly_payment, 2),
        'risk_level': risk_level,
        'approval_status': approval_status,
        'interest_rate': interest_rates[risk_level],
        'analysis_period': '90 days',
        'recommendation': get_recommendation(approval_status, disposable_income, avg_monthly_income)
    }

def get_recommendation(status, disposable, income):
    if status == 'denied':
        return 'Focus on reducing expenses and increasing income before applying for credit.'
    elif status == 'review':
        return 'Your application requires manual review. Consider improving your savings rate.'
    else:
        savings_rate = (disposable / income * 100) if income > 0 else 0
        if savings_rate > 30:
            return 'Excellent financial health! You qualify for our best rates.'
        elif savings_rate > 15:
            return 'Good financial standing. Credit approved with competitive rates.'
        else:
            return 'Credit approved. Consider building emergency savings for better terms.'
