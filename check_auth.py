import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MulaSense.settings')
django.setup()

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

print('=== AUTHENTICATION TOKENS ===')
for user in User.objects.all():
    try:
        token = Token.objects.get(user=user)
        print(f'User: {user.username} (ID: {user.id})')
        print(f'  Token: {token.key}')
    except Token.DoesNotExist:
        print(f'User: {user.username} (ID: {user.id}) - NO TOKEN')
    print()
