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
            {'name': 'Send to Registered User', 'category_type': 'transfer', 'color': '#3B82F6'},
            {'name': 'Send to Unregistered User', 'category_type': 'transfer', 'color': '#8B5CF6'},
            {'name': 'Send to Account', 'category_type': 'transfer', 'color': '#10B981'},
            {'name': 'USD to Zig', 'category_type': 'transfer', 'color': '#F59E0B'},
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
        
        self.stdout.write(self.style.SUCCESS('Categories setup complete'))