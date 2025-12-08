from django.db import models
from django.contrib.auth.models import User

class Debtor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True)
    amount_owed = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    last_transaction_date = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.name} - ${self.amount_owed}"
