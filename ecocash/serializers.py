from rest_framework import serializers
from .models import AutomaticBillPayment, EcoCashPayment

class AutomaticBillPaymentSerializer(serializers.ModelSerializer):
    budget_category_name = serializers.CharField(source='budget_category.name', read_only=True)
    
    class Meta:
        model = AutomaticBillPayment
        fields = [
            'id', 'budget_category', 'budget_category_name', 'recipient_msisdn',
            'amount', 'currency', 'reason', 'frequency', 'next_payment_date',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_recipient_msisdn(self, value):
        if not value.startswith('263'):
            raise serializers.ValidationError("Phone number must start with 263")
        if len(value) != 12:
            raise serializers.ValidationError("Phone number must be 12 digits (263XXXXXXXXX)")
        return value

class EcoCashPaymentSerializer(serializers.ModelSerializer):
    auto_payment_reason = serializers.CharField(source='auto_payment.reason', read_only=True)
    
    class Meta:
        model = EcoCashPayment
        fields = [
            'id', 'source_reference', 'customer_msisdn', 'recipient_msisdn',
            'amount', 'currency', 'reason', 'status', 'ecocash_reference',
            'error_message', 'initiated_at', 'completed_at', 'auto_payment',
            'auto_payment_reason'
        ]
        read_only_fields = [
            'id', 'source_reference', 'status', 'ecocash_reference',
            'initiated_at', 'completed_at'
        ]

class ManualPaymentSerializer(serializers.Serializer):
    customer_msisdn = serializers.CharField(max_length=15)
    recipient_msisdn = serializers.CharField(max_length=15)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)
    currency = serializers.CharField(max_length=3, default='USD')
    reason = serializers.CharField(max_length=255)
    budget_category_id = serializers.IntegerField(required=False)
    
    def validate_customer_msisdn(self, value):
        if not value.startswith('263'):
            raise serializers.ValidationError("Phone number must start with 263")
        if len(value) != 12:
            raise serializers.ValidationError("Phone number must be 12 digits")
        return value
    
    def validate_recipient_msisdn(self, value):
        if not value.startswith('263'):
            raise serializers.ValidationError("Phone number must start with 263")
        if len(value) != 12:
            raise serializers.ValidationError("Phone number must be 12 digits")
        return value
