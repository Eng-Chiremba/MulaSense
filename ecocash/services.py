import os
import http.client
import json
import uuid
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from .models import EcoCashPayment, AutomaticBillPayment

class EcoCashService:
    def __init__(self):
        self.api_key = os.environ.get('ECOCASH_API_KEY', '')
        self.base_url = 'developers.ecocash.co.zw'
        self.sandbox_endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/sandbox'
        self.live_endpoint = '/api/ecocash_pay/api/v2/payment/instant/c2b/live'
        self.is_sandbox = os.environ.get('ECOCASH_SANDBOX', 'True') == 'True'
    
    def process_payment(self, customer_msisdn, amount, reason, currency='USD', source_reference=None):
        """
        Process EcoCash C2B payment
        """
        if source_reference is None:
            source_reference = str(uuid.uuid4())
        
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
            response_data = json.loads(data.decode("utf-8"))
            
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
    
    def create_payment_record(self, user, customer_msisdn, recipient_msisdn, amount, reason, currency='USD', auto_payment=None):
        """
        Create EcoCash payment record in database
        """
        payment = EcoCashPayment.objects.create(
            user=user,
            auto_payment=auto_payment,
            customer_msisdn=customer_msisdn,
            recipient_msisdn=recipient_msisdn,
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
    
    def process_automatic_bill_payment(self, auto_payment):
        """
        Process automatic bill payment
        """
        payment = self.create_payment_record(
            user=auto_payment.user,
            customer_msisdn=auto_payment.user.profile.phone if hasattr(auto_payment.user, 'profile') else '',
            recipient_msisdn=auto_payment.recipient_msisdn,
            amount=auto_payment.amount,
            reason=auto_payment.reason,
            currency=auto_payment.currency,
            auto_payment=auto_payment
        )
        
        return self.execute_payment(payment)
