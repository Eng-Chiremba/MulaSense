from django.contrib import admin
from .models import CustomerDebt, DebtorItem, DebtorPayment

@admin.register(CustomerDebt)
class CustomerDebtAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_amount', 'amount_paid', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'phone', 'email']

@admin.register(DebtorItem)
class DebtorItemAdmin(admin.ModelAdmin):
    list_display = ['debtor', 'description', 'quantity', 'unit_price']

@admin.register(DebtorPayment)
class DebtorPaymentAdmin(admin.ModelAdmin):
    list_display = ['debtor', 'amount', 'payment_date', 'payment_method']
    list_filter = ['payment_date', 'payment_method']
