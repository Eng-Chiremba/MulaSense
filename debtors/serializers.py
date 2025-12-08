from rest_framework import serializers
from .models import CustomerDebt, DebtorItem, DebtorPayment

class DebtorItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebtorItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total_price']

class DebtorPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebtorPayment
        fields = ['id', 'amount', 'payment_date', 'payment_method', 'notes', 'created_at']

class CustomerDebtSerializer(serializers.ModelSerializer):
    items = DebtorItemSerializer(many=True, read_only=True)
    payments = DebtorPaymentSerializer(many=True, read_only=True)
    amount_remaining = serializers.SerializerMethodField()
    percentage_paid = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerDebt
        fields = ['id', 'name', 'phone', 'email', 'address', 'total_amount', 'amount_paid', 
                  'amount_remaining', 'percentage_paid', 'due_date', 'status', 'items', 'payments', 'created_at']
    
    def get_amount_remaining(self, obj):
        return obj.amount_remaining
    
    def get_percentage_paid(self, obj):
        return obj.percentage_paid

class CustomerDebtCreateSerializer(serializers.ModelSerializer):
    items = DebtorItemSerializer(many=True, required=False, write_only=True)
    
    class Meta:
        model = CustomerDebt
        fields = ['name', 'phone', 'email', 'address', 'total_amount', 'due_date', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        debt = CustomerDebt.objects.create(**validated_data)
        for item_data in items_data:
            DebtorItem.objects.create(debtor=debt, **item_data)
        return debt
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                DebtorItem.objects.create(debtor=instance, **item_data)
        
        return instance
