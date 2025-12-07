from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class FinancialHealthScore(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='health_score')
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    income_stability = models.IntegerField(default=0)
    expense_ratio = models.IntegerField(default=0)
    savings_rate = models.IntegerField(default=0)
    debt_ratio = models.IntegerField(default=0)
    budget_adherence = models.IntegerField(default=0)
    calculated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'financial_health_scores'
    
    def __str__(self):
        return f"{self.user.username} - Score: {self.score}"

class LoanApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('disbursed', 'Disbursed'),
        ('repaid', 'Repaid'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_applications')
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('5.00'))
    duration_months = models.IntegerField(default=12)
    monthly_payment = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    health_score_at_application = models.IntegerField()
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    disbursement_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'loan_applications'
        ordering = ['-application_date']
    
    def __str__(self):
        return f"{self.user.username} - ${self.amount_requested} - {self.status}"

class LoanRepayment(models.Model):
    loan = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='repayments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    principal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    class Meta:
        db_table = 'loan_repayments'
        ordering = ['-payment_date']
    
    def __str__(self):
        return f"Loan {self.loan.id} - ${self.amount}"
