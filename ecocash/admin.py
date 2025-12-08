from django.contrib import admin
from .models import AutomaticBillPayment, EcoCashPayment

@admin.register(AutomaticBillPayment)
class AutomaticBillPaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'reason', 'amount', 'frequency', 'next_payment_date', 'status']
    list_filter = ['status', 'frequency', 'currency']
    search_fields = ['user__username', 'reason', 'recipient_msisdn']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(EcoCashPayment)
class EcoCashPaymentAdmin(admin.ModelAdmin):
    list_display = ['source_reference', 'user', 'amount', 'status', 'initiated_at']
    list_filter = ['status', 'currency']
    search_fields = ['source_reference', 'user__username', 'reason']
    readonly_fields = ['source_reference', 'initiated_at', 'completed_at', 'response_data']
