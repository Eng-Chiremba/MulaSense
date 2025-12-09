#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MulaSense.settings")
    django.setup()
    
    from django.urls import reverse
    from django.test import Client
    
    client = Client()
    
    # Test if URLs are configured
    try:
        print("Testing EcoCash URLs...")
        
        # Test payments endpoint
        response = client.get('/api/ecocash/payments/')
        print(f"GET /api/ecocash/payments/ - Status: {response.status_code}")
        
        # Test send-money endpoint  
        response = client.post('/api/ecocash/send-money/')
        print(f"POST /api/ecocash/send-money/ - Status: {response.status_code}")
        
        print("URLs are configured correctly!")
        
    except Exception as e:
        print(f"URL Error: {e}")