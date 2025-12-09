import uuid
import random
import time
from decimal import Decimal
from django.utils import timezone

class MockEcoCashService:
    """
    Mock EcoCash API service that simulates real EcoCash responses
    """
    
    def __init__(self):
        self.is_mock = True
        
    def process_payment(self, customer_msisdn, amount, reason, currency='USD', source_reference=None):
        """
        Mock EcoCash payment processing with realistic responses
        """
        if source_reference is None:
            source_reference = str(uuid.uuid4())
            
        # Simulate processing delay
        time.sleep(0.5)
        
        # Mock validation
        if not customer_msisdn or not customer_msisdn.startswith('263'):
            return {
                'success': False,
                'status_code': 400,
                'data': {'error': 'Invalid phone number format'},
                'source_reference': source_reference
            }
            
        if amount <= 0:
            return {
                'success': False,
                'status_code': 400,
                'data': {'error': 'Amount must be greater than 0'},
                'source_reference': source_reference
            }
            
        # Simulate random success/failure (90% success rate)
        success = random.random() > 0.1
        
        if success:
            # Mock successful response
            mock_transaction_id = f"ECO{random.randint(100000000, 999999999)}"
            
            return {
                'success': True,
                'status_code': 200,
                'data': {
                    'transactionId': mock_transaction_id,
                    'sourceReference': source_reference,
                    'status': 'completed',
                    'amount': float(amount),
                    'currency': currency,
                    'customerMsisdn': customer_msisdn,
                    'reason': reason,
                    'timestamp': timezone.now().isoformat(),
                    'fees': round(float(amount) * 0.02, 2),  # 2% fee
                    'balance': round(random.uniform(10, 1000), 2),
                    'message': 'Payment processed successfully'
                },
                'source_reference': source_reference
            }
        else:
            # Mock failure scenarios
            error_scenarios = [
                {'code': 402, 'message': 'Insufficient funds'},
                {'code': 402, 'message': 'Daily limit exceeded'},
                {'code': 402, 'message': 'Recipient not found'},
                {'code': 429, 'message': 'Too many requests'},
                {'code': 500, 'message': 'Service temporarily unavailable'}
            ]
            
            error = random.choice(error_scenarios)
            
            return {
                'success': False,
                'status_code': error['code'],
                'data': {
                    'error': error['message'],
                    'sourceReference': source_reference,
                    'timestamp': timezone.now().isoformat()
                },
                'source_reference': source_reference
            }
    
    def get_transaction_status(self, source_reference):
        """
        Mock transaction status check
        """
        # Simulate different status scenarios
        statuses = ['pending', 'processing', 'completed', 'failed']
        status = random.choice(statuses)
        
        return {
            'success': True,
            'status_code': 200,
            'data': {
                'sourceReference': source_reference,
                'status': status,
                'timestamp': timezone.now().isoformat()
            }
        }
    
    def get_balance(self, customer_msisdn):
        """
        Mock balance inquiry
        """
        return {
            'success': True,
            'status_code': 200,
            'data': {
                'customerMsisdn': customer_msisdn,
                'balance': round(random.uniform(0, 1000), 2),
                'currency': 'USD',
                'timestamp': timezone.now().isoformat()
            }
        }
    
    @staticmethod
    def get_mock_response_examples():
        """
        Return example responses for documentation
        """
        return {
            'successful_payment': {
                'transactionId': 'ECO123456789',
                'sourceReference': '581af738-f459-4629-a72e-8388e0acdb5e',
                'status': 'completed',
                'amount': 10.50,
                'currency': 'USD',
                'customerMsisdn': '263774222475',
                'reason': 'Payment',
                'timestamp': '2024-01-15T10:30:00Z',
                'fees': 0.21,
                'balance': 89.29,
                'message': 'Payment processed successfully'
            },
            'failed_payment': {
                'error': 'Insufficient funds',
                'sourceReference': '581af738-f459-4629-a72e-8388e0acdb5e',
                'timestamp': '2024-01-15T10:30:00Z'
            },
            'status_check': {
                'sourceReference': '581af738-f459-4629-a72e-8388e0acdb5e',
                'status': 'completed',
                'timestamp': '2024-01-15T10:30:00Z'
            }
        }