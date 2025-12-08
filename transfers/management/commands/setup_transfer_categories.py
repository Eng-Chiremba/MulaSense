from django.core.management.base import BaseCommand
from accounting.models import Category


class Command(BaseCommand):
    help = 'Setup transfer categories in the database'

    def handle(self, *args, **kwargs):
        transfer_categories = [
            {
                'name': 'Send to Registered User',
                'category_type': 'expense',
                'icon': 'UserCheck',
                'color': '#3B82F6'
            },
            {
                'name': 'Send to Unregistered User',
                'category_type': 'expense',
                'icon': 'User',
                'color': '#8B5CF6'
            },
            {
                'name': 'Send to Account',
                'category_type': 'expense',
                'icon': 'Building2',
                'color': '#10B981'
            },
            {
                'name': 'USD to Zig',
                'category_type': 'expense',
                'icon': 'ArrowLeftRight',
                'color': '#F59E0B'
            },
            {
                'name': 'Transfer',
                'category_type': 'expense',
                'icon': 'ArrowRightLeft',
                'color': '#2D358B'
            }
        ]

        for cat_data in transfer_categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'category_type': cat_data['category_type'],
                    'icon': cat_data['icon'],
                    'color': cat_data['color']
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(self.style.SUCCESS('Transfer categories setup complete!'))
