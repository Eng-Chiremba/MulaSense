#!/usr/bin/env python
"""
Quick test script for EcoCash API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/ecocash"

def test_connection():
    """Test the connection endpoint (no auth required)"""
    try:
        response = requests.get(f"{BASE_URL}/test/")
        print(f"Test Connection: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False

def test_with_auth():
    """Test authenticated endpoints"""
    # First, let's try to login to get a token
    login_url = "http://localhost:8000/api/users/login/"
    
    # You'll need to create a user first or use existing credentials
    login_data = {
        "phone": "263771234567",  # Replace with your test user
        "password": "testpass123"  # Replace with your test password
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        print(f"Login: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            print(f"Token: {token[:20]}..." if token else "No token received")
            
            # Test authenticated endpoint
            headers = {"Authorization": f"Token {token}"}
            payments_response = requests.get(f"{BASE_URL}/payments/", headers=headers)
            print(f"Payments: {payments_response.status_code}")
            print(f"Response: {payments_response.json()}")
            
        else:
            print(f"Login failed: {login_response.json()}")
            
    except Exception as e:
        print(f"Auth test failed: {e}")

if __name__ == "__main__":
    print("Testing EcoCash API...")
    
    # Test connection first
    if test_connection():
        print("✓ Connection test passed")
        test_with_auth()
    else:
        print("✗ Connection test failed")