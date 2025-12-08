from rest_framework import serializers
from .models import Transfer
from django.contrib.auth.models import User

class TransferSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    recipient_user_name = serializers.CharField(source="recipient_user.username", read_only=True)
    
    class Meta:
        model = Transfer
        fields = ["id", "reference", "sender", "sender_name", "transfer_type", "recipient_user", "recipient_user_name", "recipient_phone", "recipient_account", "recipient_name", "amount", "currency_from", "currency_to", "exchange_rate", "amount_received", "description", "status", "error_message", "initiated_at", "completed_at"]
        read_only_fields = ["id", "reference", "status", "exchange_rate", "amount_received", "initiated_at", "completed_at"]

class TransferCreateSerializer(serializers.Serializer):
    recipient_phone = serializers.CharField(max_length=15, required=False)
    recipient_account = serializers.CharField(max_length=50, required=False)
    recipient_name = serializers.CharField(max_length=100, required=False)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)
    currency_from = serializers.CharField(max_length=3, default="USD")
    currency_to = serializers.CharField(max_length=3, default="USD")
    description = serializers.CharField(max_length=255, required=False)
    
    def validate_recipient_phone(self, value):
        if value and not value.startswith("263"):
            raise serializers.ValidationError("Phone number must start with 263")
        if value and len(value) != 12:
            raise serializers.ValidationError("Phone number must be 12 digits")
        return value
