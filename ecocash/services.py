import os
import http.client
import json
import uuid
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from .models import EcoCashPayment, AutomaticBillPayment

class EcoCashService:
    """
    EcoCash API Integration Service
    
    Handles payments using EcoCash Open API v2
    Base URL: https://developers.ecocash.co.zw/api/ecocash_pay/
    
    Sandbox PIN codes for testing:
    - "0000"
    - "1234" 
    - "9999"
    """
    
    def __init__(self):
        self.api_key = os.environ.get('ECOCASH_API_KEY', '1wddI46HBW3pK7pH32wgr3st9wIM7E4w')
        self.base_url = 'developers.ecocash.co.zw'
        self.sandbox_endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/sandbox'
        self.live_endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/live'
        self.is_sandbox = os.environ.get('ECOCASH_SANDBOX', 'True') == 'True'
    
    def process_payment(self, customer_msisdn, amount, reason, currency='USD', source_reference=None):
        """
        Process EcoCash C2B payment using official API
        
        Args:
            customer_msisdn (str): Customer phone number (e.g., "263774222475")
            amount (float): Payment amount
            reason (str): Payment description
            currency (str): Currency code (USD or ZIG)
            source_reference (str): UUID reference (auto-generated if None)
            
        Returns:
            dict: API response with success status and data
        """
        if source_reference is None:
            source_reference = str(uuid.uuid4())
        
        # Ensure phone number format
        if not customer_msisdn.startswith('263'):
            if customer_msisdn.startswith('0'):
                customer_msisdn = '263' + customer_msisdn[1:]
            elif customer_msisdn.startswith('+263'):
                customer_msisdn = customer_msisdn[1:]
        
        payload = {
            "customerMsisdn": customer_msisdn,
            "amount": float(amount),
            "reason": reason,
            "currency": currency,
            "sourceReference": source_reference
        }
        
        headers = {
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }
        
        try:
            conn = http.client.HTTPSConnection(self.base_url)
            endpoint = self.sandbox_endpoint if self.is_sandbox else self.live_endpoint
            
            conn.request("POST", endpoint, json.dumps(payload), headers)
            res = conn.getresponse()
            data = res.read()
            
            if res.status == 200:
                response_data = json.loads(data.decode("utf-8"))
            else:
                response_data = {'error': data.decode("utf-8")}
            
            return {
                'success': res.status == 200,
                'status_code': res.status,
                'data': response_data,
                'source_reference': source_reference
            }
        except Exception as e:
            return {
                'success': False,
                'status_code': 500,
                'error': str(e),
                'source_reference': source_reference
            }
    
    def create_payment_record(self, user, customer_msisdn, amount, reason, currency='USD', auto_payment=None):
        """
        Create EcoCash payment record in database
        """
        payment = EcoCashPayment.objects.create(
            user=user,
            auto_payment=auto_payment,
            customer_msisdn=customer_msisdn,
            amount=amount,
            currency=currency,
            reason=reason,
            status='pending'
        )
        return payment
    
    def execute_payment(self, payment):
        """
        Execute EcoCash payment and update record
        """
        payment.status = 'processing'
        payment.save()
        
        result = self.process_payment(
            customer_msisdn=payment.customer_msisdn,
            amount=payment.amount,
            reason=payment.reason,
            currency=payment.currency,
            source_reference=str(payment.source_reference)
        )
        
        if result['success']:
            payment.status = 'completed'
            payment.response_data = result['data']
            payment.completed_at = timezone.now()
            
            # Extract transaction ID from response
            if 'transactionId' in result['data']:
                payment.ecocash_transaction_id = result['data']['transactionId']
            
            # Create transaction record
            from accounting.models import Transaction, Category
            try:
                category = Category.objects.filter(category_type='expense').first()
                transaction = Transaction.objects.create(
                    user=payment.user,
                    category=category,
                    description=payment.reason,
                    amount=payment.amount,
                    transaction_type='expense',
                    status='completed',
                    transaction_date=timezone.now(),
                    notes=f"EcoCash Payment: {payment.source_reference}"
                )
                payment.transaction = transaction
            except Exception as e:
                payment.error_message = f"Transaction creation failed: {str(e)}"
        else:
            payment.status = 'failed'
            payment.error_message = result.get('error', 'Payment failed')
            payment.response_data = result.get('data', {})
        
        payment.save()
        return payment
    
    def send_money(self, user, recipient_msisdn, amount, reason, currency='USD'):
        """
        Send money to another EcoCash user
        """
        customer_msisdn = getattr(user.profile, 'phone', '') if hasattr(user, 'profile') else ''
        
        payment = self.create_payment_record(
            user=user,
            customer_msisdn=customer_msisdn,
            amount=amount,
            reason=f"Send Money: {reason}",
            currency=currency
        )
        
        return self.execute_payment(payment)
    
    def buy_airtime(self, user, phone_number, amount, currency='USD'):
        """
        Buy airtime using EcoCash
        """
        customer_msisdn = getattr(user.profile, 'phone', '') if hasattr(user, 'profile') else ''
        
        payment = self.create_payment_record(
            user=user,
            customer_msisdn=customer_msisdn,
            amount=amount,
            reason=f"Airtime for {phone_number}",
            currency=currency
        )
        
        return self.execute_payment(payment)
    
    def pay_merchant(self, user, merchant_code, amount, reason, currency='USD'):
        """
        Pay merchant using EcoCash
        """
        customer_msisdn = getattr(user.profile, 'phone', '') if hasattr(user, 'profile') else ''
        
        payment = self.create_payment_record(
            user=user,
            customer_msisdn=customer_msisdn,
            amount=amount,
            reason=f"Merchant Payment: {reason}",
            currency=currency
        )
        
        return self.execute_payment(payment)
    
    def process_automatic_bill_payment(self, auto_payment):
        """
        Process automatic bill payment
        """
        customer_msisdn = getattr(auto_payment.user.profile, 'phone', '') if hasattr(auto_payment.user, 'profile') else ''
        
        payment = self.create_payment_record(
            user=auto_payment.user,
            customer_msisdn=customer_msisdn,
            amount=auto_payment.amount,
            reason=auto_payment.reason,
            currency=auto_payment.currency,
            auto_payment=auto_payment
        )
        
        return self.execute_payment(payment)
    
    @staticmethod
    def get_status_message(status_code):
        """
        Get human-readable status message for HTTP status codes
        """
        status_messages = {
            200: "Payment successful",
            400: "Bad request - missing required parameter",
            401: "Unauthorized - invalid API key",
            402: "Payment failed - parameters valid but request failed",
            403: "Forbidden - API key lacks permissions",
            404: "Not found - resource doesn't exist",
            409: "Conflict - duplicate request",
            429: "Too many requests - rate limit exceeded",
            500: "Server error - something went wrong on EcoCash's end"
        }
        return status_messages.get(status_code, f"Unknown status: {status_code}")