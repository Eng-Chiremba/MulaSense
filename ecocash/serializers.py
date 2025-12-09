from rest_framework import serializers
from decimal import Decimal
from .models import EcoCashPayment, AutomaticBillPayment


class EcoCashPaymentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    currency_display = serializers.CharField(source='get_currency_display', read_only=True)
    
    class Meta:
        model = EcoCashPayment
        fields = [
            'id', 'customer_msisdn', 'amount', 'currency', 'currency_display',
            'reason', 'source_reference', 'status', 'status_display',
            'ecocash_transaction_id', 'response_data', 'error_message',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = (
            'user', 'source_reference', 'ecocash_transaction_id', 
            'response_data', 'error_message', 'created_at', 'updated_at', 'completed_at'
        )


class AutomaticBillPaymentSerializer(serializers.ModelSerializer):
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    currency_display = serializers.CharField(source='get_currency_display', read_only=True)
    
    class Meta:
        model = AutomaticBillPayment
        fields = [
            'id', 'bill_name', 'recipient_msisdn', 'amount', 'currency', 'currency_display',
            'reason', 'frequency', 'frequency_display', 'next_payment_date', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('user', 'created_at', 'updated_at')


class SendMoneySerializer(serializers.Serializer):
    recipient_msisdn = serializers.CharField(max_length=15, help_text="Recipient phone number")
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    reason = serializers.CharField(max_length=255, default="Money transfer")
    currency = serializers.ChoiceField(choices=[('USD', 'USD'), ('ZIG', 'ZIG')], default='USD')


class BuyAirtimeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15, help_text="Phone number for airtime")
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    currency = serializers.ChoiceField(choices=[('USD', 'USD'), ('ZIG', 'ZIG')], default='USD')


class PayMerchantSerializer(serializers.Serializer):
    merchant_code = serializers.CharField(max_length=20, help_text="Merchant code")
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    reason = serializers.CharField(max_length=255, default="Merchant payment")
    currency = serializers.ChoiceField(choices=[('USD', 'USD'), ('ZIG', 'ZIG')], default='USD')