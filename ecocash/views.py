from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import EcoCashPayment, AutomaticBillPayment
from .serializers import EcoCashPaymentSerializer, AutomaticBillPaymentSerializer


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
def manual_payment(request):
    """Handle manual EcoCash payment"""
    if request.method == 'POST':
        serializer = EcoCashPaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def callback(request):
    """Handle EcoCash payment callback"""
    # Process callback from EcoCash
    reference = request.data.get('reference')
    status_code = request.data.get('status')
    
    try:
        payment = EcoCashPayment.objects.get(reference=reference)
        payment.status = status_code
        payment.save()
        return Response({'message': 'Callback processed successfully'})
    except EcoCashPayment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)