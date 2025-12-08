from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class AutomaticBillPayment(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auto_bill_payments')
    budget_category = models.ForeignKey('budget.BudgetCategory', on_delete=models.CASCADE, related_name='auto_payments')
    recipient_msisdn = models.CharField(max_length=15, help_text="Recipient EcoCash number (263XXXXXXXXX)")
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    reason = models.CharField(max_length=255)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    next_payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auto_bill_payments'
        ordering = ['next_payment_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.reason} - ${self.amount}"

class EcoCashPayment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ecocash_payments')
    auto_payment = models.ForeignKey(AutomaticBillPayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    transaction = models.OneToOneField('accounting.Transaction', on_delete=models.SET_NULL, null=True, blank=True, related_name='ecocash_payment')
    
    source_reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    customer_msisdn = models.CharField(max_length=15)
    recipient_msisdn = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    reason = models.CharField(max_length=255)
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    ecocash_reference = models.CharField(max_length=100, blank=True, null=True)
    response_data = models.JSONField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ecocash_payments'
        ordering = ['-initiated_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['source_reference']),
        ]
    
    def __str__(self):
        return f"{self.source_reference} - {self.status}"
