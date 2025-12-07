import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MulaSense.settings')
django.setup()

from budget.models import BudgetCategory
from django.contrib.auth.models import User

print('=== BUDGET DIAGNOSIS ===')
print(f'Total budget categories: {BudgetCategory.objects.count()}')
print(f'Total users: {User.objects.count()}')
print()

if User.objects.exists():
    for user in User.objects.all():
        user_budgets = BudgetCategory.objects.filter(user=user)
        print(f'User: {user.username} (ID: {user.id})')
        print(f'  Budget categories: {user_budgets.count()}')
        for bc in user_budgets:
            print(f'    - {bc.name}: ${bc.budgeted_amount} (Spent: ${bc.spent_amount})')
        print()
else:
    print('No users found!')

print('=== ALL BUDGETS ===')
for bc in BudgetCategory.objects.all():
    print(f'{bc.id}: {bc.name} - User: {bc.user.username} - ${bc.budgeted_amount} - Active: {bc.is_active}')
