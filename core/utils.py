import requests
import random
from decimal import Decimal
from django.db.models import Sum
from users.models import Bill


def calculate_ai_score(profile):
    
    base_score = 300
    
    # Handle None values and ensure non-negative
    savings_balance = max(float(profile.savings_balance or 0), 0)
    txn_volume = max(float(profile.txn_volume_score or 0), 0)
    
    # Savings as collateral (worth 0.8 points per dollar)
    savings_points = savings_balance * 0.8
    
    # Transaction velocity shows business activity (3x multiplier)
    txn_points = txn_volume * 3
    
    # Stability bonus for consistent traders
    stability_points = 50 if txn_volume > 20 else 0
    
    final_score = base_score + savings_points + txn_points + stability_points
    
    return min(int(final_score), 900)


def generate_credit_analysis(user):
 
    if not hasattr(user, 'profile'):
        raise ValueError("User has no profile")
    
    profile = user.profile
    
    # 1. Calculate total monthly obligations
    total_bills = Bill.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum']
    total_bills = float(total_bills or Decimal('0.00'))
    
    # 2. Estimate weekly turnover (informal traders think weekly, not monthly)
    monthly_income = float(profile.monthly_income or 0)
    estimated_weekly_turnover = monthly_income / 4
    
    # 3. Calculate "Burn Rate" - what % of income goes to bills?
    if monthly_income > 0:
        obligation_ratio = (total_bills / monthly_income) * 100
    else:
        obligation_ratio = 100  # No income = 100% burn rate
    
    # 4. Assess liquidity buffer (can they survive 1-2 months without income?)
    savings = float(profile.savings_balance or 0)
    
    if savings > (total_bills * 1.5):
        liquidity_score = "HIGH"  # Can cover 1.5+ months
    elif savings > (total_bills * 0.5):
        liquidity_score = "MEDIUM"  # Can cover 2+ weeks
    else:
        liquidity_score = "LOW"  # Vulnerable to shocks
    
    # 5. Generate verdict and actionable advice
    risk_factors = []
    
    # Priority 1: Liquidity (most critical for informal sector)
    if liquidity_score == "LOW":
        verdict = "VULNERABLE"
        advice = "Your cash flow is good, but you have no buffer. Save $2/day to unlock loans."
        risk_factors.append("Zero Liquidity Buffer")
    # Priority 2: Burn rate
    elif obligation_ratio > 60:
        verdict = "OVER-LEVERAGED"
        advice = "Your fixed bills consume too much of your cash flow. Reduce recurring costs."
        risk_factors.append("High Burn Rate (Bills > 60% of Inflow)")
    else:
        verdict = "CREDITWORTHY TRADER"
        advice = "You have healthy cash flow and a safety net. You qualify for business expansion capital."
    
    return {
        "estimated_weekly_turnover": round(estimated_weekly_turnover, 2),
        "total_obligations": total_bills,
        "liquidity_status": liquidity_score,
        "cash_flow_coverage": f"{round(obligation_ratio, 1)}%",
        "risk_factors": risk_factors,
        "verdict": verdict,
        "ai_advice": advice
    }


def trigger_payment(phone, amount):
    """
    Simulate EcoCash payment trigger for loan disbursement.
    
    Args:
        phone: Mobile money number (e.g., "263771234567")
        amount: Payment amount in USD
        
    Returns:
        bool: True if payment initiated successfully
    """
    ECOCASH_MOCK_URL = "http://localhost:3001/transactions/amount"
    
    payload = {
        "clientCorrelator": f"MULA-{random.randint(1000, 9999)}",
        "notifyUrl": "http://localhost:8000/webhook",
        "amount": {
            "currencyCode": "USD",
            "value": float(amount)
        },
        "subscriber": {
            "msisdn": phone
        }
    }
    
    try:
        response = requests.post(ECOCASH_MOCK_URL, json=payload, timeout=10)
        return response.status_code == 200
    except (requests.RequestException, ValueError):
        return False
