from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum
from decimal import Decimal
from .models import CustomerDebt, DebtorPayment, DebtorItem
from .serializers import CustomerDebtSerializer, CustomerDebtCreateSerializer, DebtorPaymentSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def debtor_list(request):
    if request.method == 'GET':
        debts = CustomerDebt.objects.filter(user=request.user)
        serializer = CustomerDebtSerializer(debts, many=True)
        return Response({'data': serializer.data, 'status': 'success'})
    
    elif request.method == 'POST':
        try:
            with transaction.atomic():
                data = request.data.copy()
                items_data = data.pop('items', [])
                
                serializer = CustomerDebtCreateSerializer(data=data)
                if serializer.is_valid():
                    debt = serializer.save(user=request.user)
                    
                    for item in items_data:
                        DebtorItem.objects.create(
                            debtor=debt,
                            description=item.get('description'),
                            quantity=item.get('quantity'),
                            unit_price=item.get('unit_price'),
                            total_price=item.get('total_price')
                        )
                    
                    return Response(CustomerDebtSerializer(debt).data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def debtor_detail(request, pk):
    try:
        debt = CustomerDebt.objects.get(id=pk, user=request.user)
    except CustomerDebt.DoesNotExist:
        return Response({'error': 'Debt not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CustomerDebtSerializer(debt)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        try:
            with transaction.atomic():
                data = request.data.copy()
                items_data = data.pop('items', [])
                
                serializer = CustomerDebtCreateSerializer(debt, data=data, partial=True)
                if serializer.is_valid():
                    debt = serializer.save()
                    
                    debt.items.all().delete()
                    for item in items_data:
                        DebtorItem.objects.create(
                            debtor=debt,
                            description=item.get('description'),
                            quantity=item.get('quantity'),
                            unit_price=item.get('unit_price'),
                            total_price=item.get('total_price')
                        )
                    
                    return Response(CustomerDebtSerializer(debt).data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        debt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_payment(request, pk):
    try:
        debt = CustomerDebt.objects.get(id=pk, user=request.user)
    except CustomerDebt.DoesNotExist:
        return Response({'error': 'Debt not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        amount = Decimal(str(request.data.get('amount')))
        payment_date = request.data.get('payment_date')
        payment_method = request.data.get('payment_method', 'cash')
        notes = request.data.get('notes', '')
        
        if not amount or not payment_date:
            return Response({'error': 'Amount and payment_date required'}, status=status.HTTP_400_BAD_REQUEST)
        
        payment = DebtorPayment.objects.create(
            debtor=debt,
            amount=amount,
            payment_date=payment_date,
            payment_method=payment_method,
            notes=notes
        )
        
        debt.amount_paid += amount
        if debt.amount_paid >= debt.total_amount:
            debt.status = 'paid'
        debt.save()
        
        return Response(DebtorPaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debtor_summary(request):
    debts = CustomerDebt.objects.filter(user=request.user)
    total_amount = debts.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    total_paid = debts.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
    total_owed = total_amount - total_paid
    active_debts = debts.filter(status='active').count()
    
    return Response({
        'total_debtors': debts.count(),
        'active_debtors': active_debts,
        'total_owed': float(total_owed)
    })
