import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MulaSense.settings')
django.setup()

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from budget.models import BudgetCategory

print('=== USER-TOKEN-BUDGET MAPPING VERIFICATION ===\n')

for user in User.objects.all():
    print(f'User ID: {user.id}')
    print(f'Username: {user.username}')
    
    # Get token
    try:
        token = Token.objects.get(user=user)
        print(f'Token: {token.key}')
    except Token.DoesNotExist:
        print('Token: NO TOKEN FOUND')
    
    # Get budgets
    budgets = BudgetCategory.objects.filter(user=user, is_active=True)
    print(f'Active Budgets: {budgets.count()}')
    
    if budgets.exists():
        for budget in budgets:
            print(f'  - {budget.name}: ${budget.budgeted_amount}')
    
    print('-' * 50)
    print()

# Test token authentication
print('\n=== TOKEN AUTHENTICATION TEST ===')
test_token = '286c9609f6409f503dbfd55a6497789af124b311'  # User 0787433130
try:
    token_obj = Token.objects.get(key=test_token)
    user = token_obj.user
    print(f'Token {test_token[:20]}... belongs to:')
    print(f'  User ID: {user.id}')
    print(f'  Username: {user.username}')
    
    budgets = BudgetCategory.objects.filter(user=user, is_active=True)
    print(f'  Budgets: {budgets.count()}')
    for budget in budgets:
        print(f'    - {budget.name}: ${budget.budgeted_amount}')
except Token.DoesNotExist:
    print('Token not found!')
