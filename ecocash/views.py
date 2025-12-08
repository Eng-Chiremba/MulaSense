from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import AutomaticBillPayment, EcoCashPayment
from .serializers import AutomaticBillPaymentSerializer, EcoCashPaymentSerializer, ManualPaymentSerializer
from .services import EcoCashService

class AutomaticBillPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = AutomaticBillPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AutomaticBillPayment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute automatic bill payment manually"""
        auto_payment = self.get_object()
        
        if auto_payment.status != 'active':
            return Response(
                {'error': 'Payment is not active'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        service = EcoCashService()
        payment = service.process_automatic_bill_payment(auto_payment)
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pause automatic bill payment"""
        auto_payment = self.get_object()
        auto_payment.status = 'paused'
        auto_payment.save()
        
        serializer = self.get_serializer(auto_payment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume automatic bill payment"""
        auto_payment = self.get_object()
        auto_payment.status = 'active'
        auto_payment.save()
        
        serializer = self.get_serializer(auto_payment)
        return Response(serializer.data)

class EcoCashPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EcoCashPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return EcoCashPayment.objects.filter(user=self.request.user)

@api_view(['POST'])
def manual_payment(request):
    """Process manual EcoCash payment"""
    serializer = ManualPaymentSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    service = EcoCashService()
    
    payment = service.create_payment_record(
        user=request.user,
        customer_msisdn=data['customer_msisdn'],
        recipient_msisdn=data['recipient_msisdn'],
        amount=data['amount'],
        reason=data['reason'],
        currency=data.get('currency', 'USD')
    )
    
    payment = service.execute_payment(payment)
    
    response_serializer = EcoCashPaymentSerializer(payment)
    return Response(response_serializer.data)

@api_view(['POST'])
def callback(request):
    """Handle EcoCash payment callback"""
    # Process callback from EcoCash
    source_reference = request.data.get('sourceReference')
    
    if not source_reference:
        return Response(
            {'error': 'Missing sourceReference'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = EcoCashPayment.objects.get(source_reference=source_reference)
        payment.response_data = request.data
        payment.ecocash_reference = request.data.get('ecocashReference')
        
        if request.data.get('status') == 'SUCCESS':
            payment.status = 'completed'
        else:
            payment.status = 'failed'
            payment.error_message = request.data.get('message', 'Payment failed')
        
        payment.save()
        
        return Response({'message': 'Callback processed'})
    except EcoCashPayment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
