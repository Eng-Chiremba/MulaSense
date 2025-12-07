from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer

# Category CRUD Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    # categories can be browsable publicly for now; keep open or change to IsAuthenticated
    permission_classes = []

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []

# Transaction CRUD Views
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return transactions for the authenticated user
        queryset = Transaction.objects.filter(user=self.request.user).select_related('category').order_by('-transaction_date')
        print(f"[DEBUG] User: {self.request.user}, Transaction count: {queryset.count()}")
        return queryset

    def perform_create(self, serializer):
        # Save transaction under the authenticated user
        serializer.save(user=self.request.user)

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure user can only retrieve/update/delete their own transactions
        return Transaction.objects.filter(user=self.request.user)

# Income/Expense Tracking
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def income_expense_summary(request):
    user = request.user
    period = request.GET.get('period', 'month')  # month, week, year
    
    # Calculate date range
    now = timezone.now()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'year':
        start_date = now.replace(month=1, day=1)
    else:  # month
        start_date = now.replace(day=1)
    
    transactions = Transaction.objects.filter(
        user=user,
        transaction_date__gte=start_date,
        status='completed'
    )
    
    income = transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    expenses = transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = income - expenses
    
    return Response({
        'period': period,
        'income': income,
        'expenses': expenses,
        'balance': balance,
        'savings_rate': round((balance / income * 100) if income > 0 else 0, 1)
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def expense_by_category(request):
    user = request.user
    period = request.GET.get('period', 'month')
    
    now = timezone.now()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'year':
        start_date = now.replace(month=1, day=1)
    else:
        start_date = now.replace(day=1)
    
    expenses = Transaction.objects.filter(
        user=user,
        transaction_type='expense',
        transaction_date__gte=start_date,
        status='completed'
    ).values('category__name', 'category__color').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')
    
    return Response({'expenses_by_category': list(expenses)})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def income_by_category(request):
    user = request.user
    period = request.GET.get('period', 'month')
    
    now = timezone.now()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'year':
        start_date = now.replace(month=1, day=1)
    else:
        start_date = now.replace(day=1)
    
    income = Transaction.objects.filter(
        user=user,
        transaction_type='income',
        transaction_date__gte=start_date,
        status='completed'
    ).values('category__name', 'category__color').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')
    
    return Response({'income_by_category': list(income)})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recent_transactions(request):
    user = request.user
    limit = int(request.GET.get('limit', 10))

    transactions = Transaction.objects.filter(user=user).select_related('category').order_by('-transaction_date')[:limit]

    serializer = TransactionSerializer(transactions, many=True)
    return Response({'recent_transactions': serializer.data})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({
            'message': 'Transaction added successfully',
            'transaction': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Financial Reports Generation
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profit_loss_report(request):
    user = request.user
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    if not start_date or not end_date:
        return Response({'error': 'start_date and end_date required'}, status=status.HTTP_400_BAD_REQUEST)
    
    transactions = Transaction.objects.filter(
        user=user,
        transaction_date__date__gte=start_date,
        transaction_date__date__lte=end_date,
        status='completed'
    )
    
    income_by_category = transactions.filter(transaction_type='income').values(
        'category__name'
    ).annotate(total=Sum('amount')).order_by('-total')
    
    expense_by_category = transactions.filter(transaction_type='expense').values(
        'category__name'
    ).annotate(total=Sum('amount')).order_by('-total')
    
    total_income = sum(item['total'] for item in income_by_category)
    total_expenses = sum(item['total'] for item in expense_by_category)
    net_profit = total_income - total_expenses
    
    return Response({
        'report_type': 'Profit & Loss Statement',
        'period': f'{start_date} to {end_date}',
        'income': {
            'categories': list(income_by_category),
            'total': total_income
        },
        'expenses': {
            'categories': list(expense_by_category),
            'total': total_expenses
        },
        'net_profit': net_profit,
        'profit_margin': round((net_profit / total_income * 100) if total_income > 0 else 0, 2)
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cash_flow_report(request):
    user = request.user
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    if not start_date or not end_date:
        return Response({'error': 'start_date and end_date required'}, status=status.HTTP_400_BAD_REQUEST)
    
    transactions = Transaction.objects.filter(
        user=user,
        transaction_date__date__gte=start_date,
        transaction_date__date__lte=end_date,
        status='completed'
    ).order_by('transaction_date')
    
    cash_flow = []
    running_balance = 0
    
    for transaction in transactions:
        if transaction.transaction_type == 'income':
            running_balance += transaction.amount
        else:
            running_balance -= transaction.amount
            
        cash_flow.append({
            'date': transaction.transaction_date.date(),
            'description': transaction.description,
            'type': transaction.transaction_type,
            'amount': transaction.amount,
            'balance': running_balance
        })
    
    return Response({
        'report_type': 'Cash Flow Statement',
        'period': f'{start_date} to {end_date}',
        'transactions': cash_flow,
        'final_balance': running_balance
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def monthly_summary_report(request):
    user = request.user
    now = timezone.now()
    start_date = now.replace(day=1)

    transactions = Transaction.objects.filter(
        user=user,
        transaction_date__gte=start_date,
        status='completed'
    )
    
    income = transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    expenses = transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    
    return Response({
        'monthly_income': income,
        'monthly_expenses': expenses,
        'net_profit': income - expenses,
        'savings_rate': round((income - expenses) / income * 100 if income > 0 else 0, 1)
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def expense_analysis_report(request):
    user = request.user
    now = timezone.now()
    start_date = now.replace(day=1)

    expenses = Transaction.objects.filter(
        user=user,
        transaction_type='expense',
        transaction_date__gte=start_date,
        status='completed'
    ).values('category__name').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')
    
    return Response({'expense_analysis': list(expenses)})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_data(request):
    user = request.user
    now = timezone.now()
    current_month_start = now.replace(day=1)
    prev_month_start = (current_month_start - timedelta(days=1)).replace(day=1)

    current_transactions = Transaction.objects.filter(
        user=user,
        transaction_date__gte=current_month_start,
        status='completed'
    )
    
    prev_transactions = Transaction.objects.filter(
        user=user,
        transaction_date__gte=prev_month_start,
        transaction_date__lt=current_month_start,
        status='completed'
    )

    current_income = current_transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    current_expenses = current_transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    
    prev_income = prev_transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    prev_expenses = prev_transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    
    income_change = round(((current_income - prev_income) / prev_income * 100) if prev_income > 0 else 0, 1)
    expense_change = round(((current_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses > 0 else 0, 1)
    savings_change = round((((current_income - current_expenses) - (prev_income - prev_expenses)) / (prev_income - prev_expenses) * 100) if (prev_income - prev_expenses) > 0 else 0, 1)

    recent = Transaction.objects.filter(user=user).select_related('category').order_by('-transaction_date')[:10]
    recent_serialized = TransactionSerializer(recent, many=True).data

    return Response({
        'financial_summary': {
            'monthly_income': current_income,
            'monthly_expenses': current_expenses,
            'net_savings': current_income - current_expenses,
            'savings_rate': round((current_income - current_expenses) / current_income * 100 if current_income > 0 else 0, 1),
            'income_change': income_change,
            'expense_change': expense_change,
            'savings_change': savings_change,
        },
        'recent_transactions': recent_serialized
    })

@api_view(['GET'])
def generate_monthly_report(request):
    from django.http import HttpResponse
    return HttpResponse('Monthly Excel report generation not implemented yet', content_type='text/plain')