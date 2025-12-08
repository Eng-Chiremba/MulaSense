import random
import uuid
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Transfer
from accounting.models import Transaction, Category

class TransferService:
    def __init__(self):
        self.is_mock = True
        self.exchange_rates = {
            "USD_ZWL": Decimal("13.5"),
            "ZWL_USD": Decimal("0.074"),
            "USD_ZIG": Decimal("13.5"),
            "ZIG_USD": Decimal("0.074")
        }
    
    def send_to_registered_user(self, sender, recipient_phone, amount, description):
        try:
            recipient = User.objects.get(profile__phone=recipient_phone)
        except:
            recipient = None
        
        transfer = Transfer.objects.create(
            sender=sender,
            transfer_type="send_to_registered",
            recipient_user=recipient,
            recipient_phone=recipient_phone,
            amount=amount,
            description=description,
            status="processing"
        )
        
        return self._process_transfer(transfer)
    
    def send_to_unregistered_user(self, sender, recipient_phone, recipient_name, amount, description):
        transfer = Transfer.objects.create(
            sender=sender,
            transfer_type="send_to_unregistered",
            recipient_phone=recipient_phone,
            recipient_name=recipient_name,
            amount=amount,
            description=description,
            status="processing"
        )
        
        return self._process_transfer(transfer)
    
    def send_to_account(self, sender, account_number, recipient_name, amount, description):
        transfer = Transfer.objects.create(
            sender=sender,
            transfer_type="send_to_account",
            recipient_account=account_number,
            recipient_name=recipient_name,
            amount=amount,
            description=description,
            status="processing"
        )
        
        return self._process_transfer(transfer)
    
    def currency_exchange(self, sender, amount, currency_from, currency_to, description):
        rate_key = f"{currency_from}_{currency_to}"
        exchange_rate = self.exchange_rates.get(rate_key, Decimal("1.0"))
        amount_received = amount * exchange_rate
        
        transfer = Transfer.objects.create(
            sender=sender,
            transfer_type="usd_to_zig",
            amount=amount,
            currency_from=currency_from,
            currency_to=currency_to,
            exchange_rate=exchange_rate,
            amount_received=amount_received,
            description=description,
            status="processing"
        )
        
        return self._process_transfer(transfer)
    
    def _process_transfer(self, transfer):
        success = random.random() < 0.95
        
        if success:
            transfer.status = "completed"
            transfer.completed_at = timezone.now()
            transfer.response_data = {"status": "SUCCESS", "reference": str(transfer.reference), "timestamp": timezone.now().isoformat()}
            
            try:
                category, _ = Category.objects.get_or_create(name="Transfer", defaults={"category_type": "expense", "icon": "ArrowRightLeft", "color": "#2D358B"})
                transaction = Transaction.objects.create(
                    user=transfer.sender,
                    category=category,
                    description=transfer.description,
                    amount=transfer.amount,
                    transaction_type="transfer",
                    status="completed",
                    transaction_date=timezone.now(),
                    notes=f"Transfer: {transfer.reference}"
                )
                transfer.transaction = transaction
            except Exception as e:
                transfer.error_message = f"Transaction creation failed: {str(e)}"
        else:
            transfer.status = "failed"
            transfer.error_message = random.choice(["Insufficient funds", "Invalid recipient", "Network error"])
            transfer.response_data = {"status": "FAILED", "message": transfer.error_message}
        
        transfer.save()
        return transfer
