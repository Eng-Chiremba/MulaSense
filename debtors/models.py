from django.db import models
from django.contrib.auth.models import User

class CustomerDebt(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paid', 'Paid'),
        ('defaulted', 'Defaulted'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_debts')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    @property
    def amount_remaining(self):
        return self.total_amount - self.amount_paid
    
    @property
    def percentage_paid(self):
        if self.total_amount == 0:
            return 0
        return (self.amount_paid / self.total_amount) * 100

class DebtorItem(models.Model):
    debtor = models.ForeignKey(CustomerDebt, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def line_total(self):
        return self.quantity * self.unit_price

class DebtorPayment(models.Model):
    debtor = models.ForeignKey(CustomerDebt, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=50, default='cash')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-payment_date']
