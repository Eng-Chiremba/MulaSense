from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from decimal import Decimal
import re

def validate_username_unique(value):
    """Validate username is unique (case-insensitive)"""
    if User.objects.filter(username__iexact=value).exists():
        raise ValidationError('Username already exists.')

def validate_email_unique(value):
    """Validate email is unique (case-insensitive)"""
    if User.objects.filter(email__iexact=value).exists():
        raise ValidationError('Email already exists.')

def validate_phone_number(value):
    """Validate phone number format"""
    if value and not re.match(r'^\+?1?\d{9,15}$', value):
        raise ValidationError('Invalid phone number format.')

def validate_positive_amount(value):
    """Validate amount is positive"""
    if value <= Decimal('0'):
        raise ValidationError('Amount must be positive.')

def validate_currency_code(value):
    """Validate currency code format"""
    valid_currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY']
    if value not in valid_currencies:
        raise ValidationError(f'Invalid currency code. Must be one of: {", ".join(valid_currencies)}')

def validate_budget_period(value):
    """Validate budget period"""
    valid_periods = ['weekly', 'monthly', 'yearly']
    if value not in valid_periods:
        raise ValidationError(f'Invalid period. Must be one of: {", ".join(valid_periods)}')

def validate_transaction_type(value):
    """Validate transaction type"""
    valid_types = ['income', 'expense', 'transfer']
    if value not in valid_types:
        raise ValidationError(f'Invalid transaction type. Must be one of: {", ".join(valid_types)}')

def validate_goal_type(value):
    """Validate goal type"""
    valid_types = ['savings', 'debt_payoff', 'investment', 'emergency_fund', 'other']
    if value not in valid_types:
        raise ValidationError(f'Invalid goal type. Must be one of: {", ".join(valid_types)}')

def validate_priority_range(value):
    """Validate priority is between 1 and 5"""
    if not (1 <= value <= 5):
        raise ValidationError('Priority must be between 1 and 5.')

def validate_percentage(value):
    """Validate percentage is between 0 and 100"""
    if not (0 <= value <= 100):
        raise ValidationError('Percentage must be between 0 and 100.')

def validate_future_date(value):
    """Validate date is in the future"""
    from datetime import date
    if value <= date.today():
        raise ValidationError('Date must be in the future.')

def validate_description_length(value):
    """Validate description is not too short"""
    if len(value.strip()) < 3:
        raise ValidationError('Description must be at least 3 characters long.')

def validate_no_special_chars(value):
    """Validate string contains no special characters"""
    if not re.match(r'^[a-zA-Z0-9\s]+$', value):
        raise ValidationError('Only letters, numbers, and spaces are allowed.')