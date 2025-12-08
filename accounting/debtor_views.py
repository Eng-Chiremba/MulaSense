from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from .debtor_models import Debtor
from .models import Transaction
from rest_framework import serializers

class DebtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debtor
        fields = ['id', 'name', 'phone_number', 'amount_owed', 'due_date', 'last_transaction_date']

class DebtorListCreateView(generics.ListCreateAPIView):
    serializer_class = DebtorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Debtor.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DebtorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DebtorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Debtor.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def total_debt_owed(request):
    total = Debtor.objects.filter(user=request.user).aggregate(Sum('amount_owed'))['amount_owed__sum'] or 0
    return Response({'total_owed': total})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def settle_debt(request, debtor_id):
    try:
        debtor = Debtor.objects.get(id=debtor_id, user=request.user)
        amount = debtor.amount_owed
        
        Transaction.objects.create(
            user=request.user,
            description=f"Debt Settlement - {debtor.name}",
            amount=amount,
            transaction_type='income',
            status='completed'
        )
        
        debtor.delete()
        return Response({'message': 'Debt settled successfully'}, status=status.HTTP_200_OK)
    except Debtor.DoesNotExist:
        return Response({'error': 'Debtor not found'}, status=status.HTTP_404_NOT_FOUND)
