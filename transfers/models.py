from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class Transfer(models.Model):
    TRANSFER_TYPES = [
        ('send_to_registered', 'Send to Registered User'),
        ('send_to_unregistered', 'Send to Unregistered User'),
        ('send_to_account', 'Send to Account'),
        ('usd_to_zig', 'USD to Zig'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transfers')
    transfer_type = models.CharField(max_length=20, choices=TRANSFER_TYPES)
    
    # Recipient details
    recipient_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_transfers')
    recipient_phone = models.CharField(max_length=15, blank=True)
    recipient_account = models.CharField(max_length=50, blank=True)
    recipient_name = models.CharField(max_length=100, blank=True)
    
    # Amount details
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency_from = models.CharField(max_length=3, default='USD')
    currency_to = models.CharField(max_length=3, default='USD')
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4, default=Decimal('1.0000'))
    amount_received = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Transaction details
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    transaction = models.OneToOneField('accounting.Transaction', on_delete=models.SET_NULL, null=True, blank=True, related_name='transfer')
    
    # Metadata
    response_data = models.JSONField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'transfers'
        ordering = ['-initiated_at']
        indexes = [
            models.Index(fields=['sender', 'status']),
            models.Index(fields=['reference']),
        ]
    
    def __str__(self):
        return f"{self.reference} - {self.transfer_type} - {self.amount}"
