from django.contrib import admin
from .models import Transfer

@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    list_display = ["reference", "sender", "transfer_type", "amount", "status", "initiated_at"]
    list_filter = ["status", "transfer_type"]
    search_fields = ["reference", "sender__username", "recipient_phone"]
    readonly_fields = ["reference", "initiated_at", "completed_at"]
