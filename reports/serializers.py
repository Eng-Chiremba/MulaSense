from rest_framework import serializers

class ReportRequestSerializer(serializers.Serializer):
    REPORT_TYPES = [
        ('income_expense', 'Income vs Expense'),
        ('budget_analysis', 'Budget Analysis'),
        ('goal_progress', 'Goal Progress'),
        ('category_breakdown', 'Category Breakdown'),
    ]
    
    report_type = serializers.ChoiceField(choices=REPORT_TYPES)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
class ReportDataSerializer(serializers.Serializer):
    report_type = serializers.CharField()
    data = serializers.JSONField()
    generated_at = serializers.DateTimeField()