from rest_framework import serializers
from .models import BudgetCategory, Goal, GoalContribution

class BudgetCategorySerializer(serializers.ModelSerializer):
    remaining_amount = serializers.ReadOnlyField()
    percentage_used = serializers.ReadOnlyField()
    
    class Meta:
        model = BudgetCategory
        fields = ['id', 'name', 'budgeted_amount', 'spent_amount', 'remaining_amount', 
                 'percentage_used', 'period', 'start_date', 'end_date', 'is_active', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Goal
        fields = ['id', 'name', 'description', 'goal_type', 'target_amount', 'current_amount',
                 'progress_percentage', 'remaining_amount', 'target_date', 'days_remaining',
                 'status', 'priority', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class GoalContributionSerializer(serializers.ModelSerializer):
    goal_name = serializers.CharField(source='goal.name', read_only=True)
    
    class Meta:
        model = GoalContribution
        fields = ['id', 'goal', 'goal_name', 'amount', 'contribution_date', 'notes']
        read_only_fields = ['contribution_date']