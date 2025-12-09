from django.db import models
from django.contrib.auth.models import User
import uuid


class EcoCashPayment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('ZIG', 'Zimbabwe Gold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer_msisdn = models.CharField(max_length=15, default="263000000000", help_text="Customer phone number")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    reason = models.CharField(max_length=255, default="Payment", help_text="Payment description")
    source_reference = models.UUIDField(default=uuid.uuid4, unique=True, help_text="Unique payment reference")
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # EcoCash API response data
    ecocash_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    response_data = models.JSONField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    # Linked transaction
    transaction = models.ForeignKey('accounting.Transaction', on_delete=models.SET_NULL, blank=True, null=True)
    auto_payment = models.ForeignKey('AutomaticBillPayment', on_delete=models.SET_NULL, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"EcoCash Payment - {self.source_reference} - {self.status}"


class AutomaticBillPayment(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('ZIG', 'Zimbabwe Gold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bill_name = models.CharField(max_length=100)
    recipient_msisdn = models.CharField(max_length=15, default="263000000000", help_text="Recipient phone number")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    reason = models.CharField(max_length=255, default="Bill Payment", help_text="Payment description")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='monthly')
    next_payment_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Auto Payment - {self.bill_name} - {self.frequency}"