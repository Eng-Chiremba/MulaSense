from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from accounting.models import Category, Transaction
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Creates test data for development'

    def handle(self, *args, **kwargs):
        # Create test user if it doesn't exist
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={'email': 'test@example.com'}
        )
        if created:
            user.set_password('testpass')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created test user'))

        # Create categories
        categories_data = [
            {'name': 'Salary', 'category_type': 'income', 'color': '#4CAF50'},
            {'name': 'Freelance', 'category_type': 'income', 'color': '#8BC34A'},
            {'name': 'Investments', 'category_type': 'income', 'color': '#009688'},
            {'name': 'Food & Dining', 'category_type': 'expense', 'color': '#F44336'},
            {'name': 'Transportation', 'category_type': 'expense', 'color': '#FF9800'},
            {'name': 'Housing', 'category_type': 'expense', 'color': '#795548'},
            {'name': 'Entertainment', 'category_type': 'expense', 'color': '#9C27B0'},
            {'name': 'Shopping', 'category_type': 'expense', 'color': '#E91E63'},
            {'name': 'Healthcare', 'category_type': 'expense', 'color': '#00BCD4'},
            {'name': 'Other', 'category_type': 'expense', 'color': '#9E9E9E'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'category_type': cat_data['category_type'],
                    'color': cat_data['color']
                }
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create sample transactions
        if not Transaction.objects.exists():
            income_categories = Category.objects.filter(category_type='income')
            expense_categories = Category.objects.filter(category_type='expense')
            
            # Generate transactions for the last 30 days
            end_date = timezone.now()
            start_date = end_date - timedelta(days=30)
            
            # Sample transaction descriptions
            income_descriptions = [
                'Monthly Salary', 'Contract Work', 'Investment Returns',
                'Side Project', 'Consulting Fee', 'Bonus Payment'
            ]
            expense_descriptions = [
                'Grocery Shopping', 'Restaurant Bill', 'Gas Station',
                'Movie Tickets', 'Electric Bill', 'Internet Bill',
                'Phone Bill', 'Rent Payment', 'Coffee Shop'
            ]
            
            # Create random transactions
            for _ in range(20):  # Adjust number of transactions as needed
                transaction_date = start_date + timedelta(
                    seconds=random.randint(0, int((end_date - start_date).total_seconds()))
                )
                
                # Random income transactions
                Transaction.objects.create(
                    user=user,
                    category=random.choice(income_categories),
                    description=random.choice(income_descriptions),
                    amount=round(random.uniform(1000, 5000), 2),
                    transaction_type='income',
                    transaction_date=transaction_date
                )
                
                # Random expense transactions
                for _ in range(2):  # Create more expenses than income
                    Transaction.objects.create(
                        user=user,
                        category=random.choice(expense_categories),
                        description=random.choice(expense_descriptions),
                        amount=round(random.uniform(10, 500), 2),
                        transaction_type='expense',
                        transaction_date=transaction_date + timedelta(hours=random.randint(1, 24))
                    )
            
            self.stdout.write(self.style.SUCCESS('Created sample transactions'))