from rest_framework import serializers
from .models import Transaction, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'transaction_type', 'category', 
                 'status', 'transaction_date', 'notes', 'receipt_url', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']