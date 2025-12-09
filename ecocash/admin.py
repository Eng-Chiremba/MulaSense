from django.contrib import admin
from .models import EcoCashPayment, AutomaticBillPayment


@admin.register(EcoCashPayment)
class EcoCashPaymentAdmin(admin.ModelAdmin):
    list_display = ('source_reference', 'user', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency', 'created_at')
    search_fields = ('source_reference', 'customer_msisdn', 'reason')
    readonly_fields = ('source_reference', 'ecocash_transaction_id', 'response_data', 'created_at', 'updated_at')


@admin.register(AutomaticBillPayment)
class AutomaticBillPaymentAdmin(admin.ModelAdmin):
    list_display = ('bill_name', 'user', 'amount', 'currency', 'frequency', 'is_active', 'next_payment_date')
    list_filter = ('frequency', 'currency', 'is_active', 'created_at')
    search_fields = ('bill_name', 'recipient_msisdn', 'reason')
    readonly_fields = ('created_at', 'updated_at')