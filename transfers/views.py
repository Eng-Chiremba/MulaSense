from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Transfer
from .serializers import TransferSerializer, TransferCreateSerializer
from .services import TransferService

class TransferViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transfer.objects.filter(sender=self.request.user)

@api_view(['POST'])
def send_to_registered_user(request):
    """Send money to registered user"""
    serializer = TransferCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    service = TransferService()
    
    transfer = service.send_to_registered_user(
        sender=request.user,
        recipient_phone=data['recipient_phone'],
        amount=data['amount'],
        description=data.get('description', 'Transfer to registered user')
    )
    
    response_serializer = TransferSerializer(transfer)
    return Response(response_serializer.data)

@api_view(['POST'])
def send_to_unregistered_user(request):
    """Send money to unregistered user via phone"""
    serializer = TransferCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    service = TransferService()
    
    transfer = service.send_to_unregistered_user(
        sender=request.user,
        recipient_phone=data['recipient_phone'],
        recipient_name=data.get('recipient_name', ''),
        amount=data['amount'],
        description=data.get('description', 'Transfer to unregistered user')
    )
    
    response_serializer = TransferSerializer(transfer)
    return Response(response_serializer.data)

@api_view(['POST'])
def send_to_account(request):
    """Send money to bank account"""
    serializer = TransferCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    service = TransferService()
    
    transfer = service.send_to_account(
        sender=request.user,
        account_number=data['recipient_account'],
        recipient_name=data.get('recipient_name', ''),
        amount=data['amount'],
        description=data.get('description', 'Transfer to account')
    )
    
    response_serializer = TransferSerializer(transfer)
    return Response(response_serializer.data)

@api_view(['POST'])
def currency_exchange(request):
    """Exchange USD to ZIG"""
    serializer = TransferCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    service = TransferService()
    
    transfer = service.currency_exchange(
        sender=request.user,
        amount=data['amount'],
        currency_from=data.get('currency_from', 'USD'),
        currency_to=data.get('currency_to', 'ZWL'),
        description=data.get('description', 'Currency exchange')
    )
    
    response_serializer = TransferSerializer(transfer)
    return Response(response_serializer.data)

@api_view(['GET'])
def transfer_history(request):
    """Get user's transfer history"""
    transfers = Transfer.objects.filter(sender=request.user).order_by('-initiated_at')
    serializer = TransferSerializer(transfers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def transfer_detail(request, reference):
    """Get transfer details by reference"""
    try:
        transfer = Transfer.objects.get(reference=reference, sender=request.user)
        serializer = TransferSerializer(transfer)
        return Response(serializer.data)
    except Transfer.DoesNotExist:
        return Response(
            {'error': 'Transfer not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def transfer_categories(request):
    """Get available transfer categories"""
    categories = [
        {
            'id': 'send_to_registered',
            'name': 'Send to Registered User',
            'description': 'Send money to a registered MulaSense user',
            'icon': 'UserCheck',
            'required_fields': ['recipient_phone', 'amount', 'description']
        },
        {
            'id': 'send_to_unregistered',
            'name': 'Send to Unregistered User',
            'description': 'Send money to a phone number (not registered)',
            'icon': 'User',
            'required_fields': ['recipient_phone', 'recipient_name', 'amount', 'description']
        },
        {
            'id': 'send_to_account',
            'name': 'Send to Account',
            'description': 'Send money to a bank account',
            'icon': 'Building2',
            'required_fields': ['recipient_account', 'recipient_name', 'amount', 'description']
        },
        {
            'id': 'usd_to_zig',
            'name': 'USD to Zig',
            'description': 'Exchange USD to ZIG currency',
            'icon': 'ArrowLeftRight',
            'required_fields': ['amount', 'currency_from', 'currency_to', 'description']
        }
    ]
    return Response(categories)

@api_view(['GET'])
def exchange_rates(request):
    """Get current exchange rates"""
    service = TransferService()
    rates = {
        'USD_ZIG': float(service.exchange_rates.get('USD_ZIG', 13.5)),
        'ZIG_USD': float(service.exchange_rates.get('ZIG_USD', 0.074)),
        'USD_ZWL': float(service.exchange_rates.get('USD_ZWL', 13.5)),
        'ZWL_USD': float(service.exchange_rates.get('ZWL_USD', 0.074)),
        'last_updated': timezone.now().isoformat()
    }
    return Response(rates)
