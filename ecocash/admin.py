from django.contrib import admin
from .models import EcoCashPayment, AutomaticBillPayment


@admin.register(EcoCashPayment)
class EcoCashPaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'user', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('reference', 'phone_number')


@admin.register(AutomaticBillPayment)
class AutomaticBillPaymentAdmin(admin.ModelAdmin):
    list_display = ('bill_name', 'user', 'amount', 'frequency', 'is_active')
    list_filter = ('frequency', 'is_active')
    search_fields = ('bill_name',)