from rest_framework import serializers
from .models import EcoCashPayment, AutomaticBillPayment


class EcoCashPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcoCashPayment
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class AutomaticBillPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomaticBillPayment
        fields = '__all__'
        read_only_fields = ('user', 'created_at')