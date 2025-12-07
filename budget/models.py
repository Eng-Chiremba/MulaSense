from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from datetime import date

class BudgetCategory(models.Model):
    PERIOD_CHOICES = [
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('yearly', 'Yearly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budget_categories')
    name = models.CharField(max_length=100)
    budgeted_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    spent_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES, default='monthly')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budget_categories'
        unique_together = ['user', 'name', 'start_date']
        ordering = ['name']
    
    @property
    def remaining_amount(self):
        return self.budgeted_amount - self.spent_amount
    
    @property
    def percentage_used(self):
        if self.budgeted_amount > 0:
            return (self.spent_amount / self.budgeted_amount) * 100
        return 0
    
    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.start_date})"

class Goal(models.Model):
    GOAL_TYPES = [
        ('savings', 'Savings'),
        ('debt_payoff', 'Debt Payoff'),
        ('investment', 'Investment'),
        ('emergency_fund', 'Emergency Fund'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    goal_type = models.CharField(max_length=15, choices=GOAL_TYPES)
    target_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    current_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    target_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    priority = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'goals'
        ordering = ['priority', '-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['target_date']),
        ]
    
    @property
    def progress_percentage(self):
        if self.target_amount > 0:
            return min((self.current_amount / self.target_amount) * 100, 100)
        return 0
    
    @property
    def remaining_amount(self):
        return max(self.target_amount - self.current_amount, Decimal('0.00'))
    
    @property
    def days_remaining(self):
        return (self.target_date - date.today()).days
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"

class GoalContribution(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    contribution_date = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'goal_contributions'
        ordering = ['-contribution_date']
    
    def __str__(self):
        return f"{self.goal.name} - ${self.amount}"