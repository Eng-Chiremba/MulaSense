from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import EcoCashPayment, AutomaticBillPayment
from .serializers import EcoCashPaymentSerializer, AutomaticBillPaymentSerializer
from .services import EcoCashService


class EcoCashPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = EcoCashPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EcoCashPayment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AutomaticBillPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = AutomaticBillPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AutomaticBillPayment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_money(request):
    """
    Send money to another EcoCash user
    
    POST /api/ecocash/send-money/
    {
        "recipient_msisdn": "263774222475",
        "amount": 10.50,
        "reason": "Payment for services",
        "currency": "USD"
    }
    """
    service = EcoCashService()
    
    recipient_msisdn = request.data.get('recipient_msisdn')
    amount = request.data.get('amount')
    reason = request.data.get('reason', 'Money transfer')
    currency = request.data.get('currency', 'USD')
    
    if not recipient_msisdn or not amount:
        return Response(
            {'error': 'recipient_msisdn and amount are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = service.send_money(
            user=request.user,
            recipient_msisdn=recipient_msisdn,
            amount=amount,
            reason=reason,
            currency=currency
        )
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_airtime(request):
    """
    Buy airtime using EcoCash
    
    POST /api/ecocash/buy-airtime/
    {
        "phone_number": "263774222475",
        "amount": 5.00,
        "currency": "USD"
    }
    """
    service = EcoCashService()
    
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')
    currency = request.data.get('currency', 'USD')
    
    if not phone_number or not amount:
        return Response(
            {'error': 'phone_number and amount are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = service.buy_airtime(
            user=request.user,
            phone_number=phone_number,
            amount=amount,
            currency=currency
        )
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_merchant(request):
    """
    Pay merchant using EcoCash
    
    POST /api/ecocash/pay-merchant/
    {
        "merchant_code": "12345",
        "amount": 25.00,
        "reason": "Grocery shopping",
        "currency": "USD"
    }
    """
    service = EcoCashService()
    
    merchant_code = request.data.get('merchant_code')
    amount = request.data.get('amount')
    reason = request.data.get('reason', 'Merchant payment')
    currency = request.data.get('currency', 'USD')
    
    if not merchant_code or not amount:
        return Response(
            {'error': 'merchant_code and amount are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = service.pay_merchant(
            user=request.user,
            merchant_code=merchant_code,
            amount=amount,
            reason=reason,
            currency=currency
        )
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_payment(request):
    """
    Handle manual EcoCash payment
    
    POST /api/ecocash/manual-payment/
    {
        "customer_msisdn": "263774222475",
        "amount": 10.50,
        "reason": "Payment",
        "currency": "USD"
    }
    """
    service = EcoCashService()
    
    customer_msisdn = request.data.get('customer_msisdn')
    amount = request.data.get('amount')
    reason = request.data.get('reason', 'Payment')
    currency = request.data.get('currency', 'USD')
    
    if not customer_msisdn or not amount:
        return Response(
            {'error': 'customer_msisdn and amount are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = service.create_payment_record(
            user=request.user,
            customer_msisdn=customer_msisdn,
            amount=amount,
            reason=reason,
            currency=currency
        )
        
        payment = service.execute_payment(payment)
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def callback(request):
    """
    Handle EcoCash payment callback
    
    POST /api/ecocash/callback/
    {
        "sourceReference": "581af738-f459-4629-a72e-8388e0acdb5e",
        "status": "completed",
        "transactionId": "ECO123456789"
    }
    """
    source_reference = request.data.get('sourceReference')
    payment_status = request.data.get('status')
    transaction_id = request.data.get('transactionId')
    
    if not source_reference:
        return Response(
            {'error': 'sourceReference is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment = EcoCashPayment.objects.get(source_reference=source_reference)
        
        if payment_status:
            payment.status = payment_status
        
        if transaction_id:
            payment.ecocash_transaction_id = transaction_id
        
        payment.response_data = request.data
        payment.save()
        
        return Response({'message': 'Callback processed successfully'})
        
    except EcoCashPayment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, source_reference):
    """
    Get payment status by source reference
    
    GET /api/ecocash/payment-status/{source_reference}/
    """
    try:
        payment = EcoCashPayment.objects.get(
            source_reference=source_reference,
            user=request.user
        )
        
        serializer = EcoCashPaymentSerializer(payment)
        return Response(serializer.data)
        
    except EcoCashPayment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )