from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
import requests
from django.conf import settings
from .models import Conversation
from .serializers import ChatMessageSerializer, ConversationSerializer
from accounting.models import Transaction
from budget.models import BudgetCategory, Goal

# OpenRouter API Configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = getattr(settings, 'OPENROUTER_API_KEY', 'your-api-key-here')

def call_openrouter_ai(prompt, model="meta-llama/llama-3.1-8b-instruct:free"):
    """Call OpenRouter AI API"""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mulasense.onrender.com",
        "X-Title": "MulaSense Financial Advisor"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post(OPENROUTER_API_URL, headers=headers, json=data, timeout=30)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def get_user_financial_context(user):
    """Get user's financial data for AI context"""
    current_month = timezone.now().replace(day=1)
    
    # Recent transactions
    recent_transactions = Transaction.objects.filter(
        user=user, status='completed'
    ).order_by('-transaction_date')[:10]
    
    # Monthly summary
    income = Transaction.objects.filter(
        user=user, transaction_type='income',
        transaction_date__gte=current_month, status='completed'
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    expenses = Transaction.objects.filter(
        user=user, transaction_type='expense',
        transaction_date__gte=current_month, status='completed'
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Budget categories
    budget_categories = BudgetCategory.objects.filter(user=user, is_active=True)
    
    # Goals
    active_goals = Goal.objects.filter(user=user, status='active')
    
    return {
        'monthly_income': float(income),
        'monthly_expenses': float(expenses),
        'balance': float(income - expenses),
        'budget_categories': [{
            'name': cat.name,
            'budgeted': float(cat.budgeted_amount),
            'spent': float(cat.spent_amount),
            'percentage_used': cat.percentage_used
        } for cat in budget_categories],
        'goals': [{
            'name': goal.name,
            'target': float(goal.target_amount),
            'current': float(goal.current_amount),
            'progress': goal.progress_percentage
        } for goal in active_goals],
        'recent_transactions': [{
            'description': t.description,
            'amount': float(t.amount),
            'type': t.transaction_type,
            'category': t.category.name
        } for t in recent_transactions]
    }

@api_view(['POST'])
def chat_with_ai(request):
    serializer = ChatMessageSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        
        try:
            # Get user financial context
            context = get_user_financial_context(request.user)
            
            # Create prompt with context
            prompt = f"""
You are MulaSense AI, a financial advisor assistant. Here's the user's financial context:

Monthly Income: ${context['monthly_income']}
Monthly Expenses: ${context['monthly_expenses']}
Current Balance: ${context['balance']}

Budget Categories: {context['budget_categories']}
Goals: {context['goals']}
Recent Transactions: {context['recent_transactions'][:5]}

User Question: {message}

Provide helpful, personalized financial advice based on their data. Keep responses concise and actionable.
"""
            
            # Generate AI response
            ai_response = call_openrouter_ai(prompt)
            
            # Save conversation
            Conversation.objects.create(
                user=request.user,
                message=message,
                response=ai_response,
                conversation_type='chat'
            )
            
            return Response({
                'message': message,
                'response': ai_response
            })
            
        except Exception as e:
            print(f"AI Chat Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': 'AI service unavailable',
                'fallback_response': f'I\'m currently unable to process your request. Error: {str(e)}'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def generate_financial_insights(request):
    try:
        context = get_user_financial_context(request.user)
        
        prompt = f"""
Analyze this user's financial data and provide 3-5 key insights:

Monthly Income: ${context['monthly_income']}
Monthly Expenses: ${context['monthly_expenses']}
Balance: ${context['balance']}
Budget Categories: {context['budget_categories']}
Goals: {context['goals']}

Provide insights about:
1. Spending patterns
2. Budget performance
3. Goal progress
4. Areas for improvement

Format as bullet points, be specific and actionable.
"""
        
        insights = call_openrouter_ai(prompt)
        
        # Save as conversation
        Conversation.objects.create(
            user=request.user,
            message="Generate financial insights",
            response=insights,
            conversation_type='insight'
        )
        
        return Response({
            'insights': insights,
            'generated_at': timezone.now()
        })
        
    except Exception as e:
        print(f"AI Insights Error: {str(e)}")
        return Response({
            'error': 'Unable to generate insights',
            'message': str(e)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
def get_recommendations(request):
    try:
        context = get_user_financial_context(request.user)
        
        prompt = f"""
Based on this financial data, provide 3-5 specific recommendations:

Income: ${context['monthly_income']}
Expenses: ${context['monthly_expenses']}
Savings Rate: {((context['balance']/context['monthly_income'])*100) if context['monthly_income'] > 0 else 0:.1f}%

Budget Performance: {context['budget_categories']}
Goals: {context['goals']}

Provide actionable recommendations for:
1. Budget optimization
2. Expense reduction
3. Savings improvement
4. Goal achievement

Format as numbered list with specific amounts/percentages where possible.
"""
        
        recommendations = call_openrouter_ai(prompt)
        
        # Save as conversation
        Conversation.objects.create(
            user=request.user,
            message="Generate recommendations",
            response=recommendations,
            conversation_type='recommendation'
        )
        
        return Response({
            'recommendations': recommendations,
            'generated_at': timezone.now()
        })
        
    except Exception as e:
        print(f"AI Recommendations Error: {str(e)}")
        return Response({
            'error': 'Unable to generate recommendations',
            'message': str(e)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
def conversation_history(request):
    conversations = Conversation.objects.filter(user=request.user)[:20]
    serializer = ConversationSerializer(conversations, many=True)
    return Response({'conversations': serializer.data})

@api_view(['POST'])
def business_advisor(request):
    """AI advisor specifically for SME business insights"""
    try:
        user = request.user
        current_month = timezone.now().replace(day=1)
        
        # Get business metrics
        transactions = Transaction.objects.filter(
            user=user,
            transaction_date__gte=current_month,
            status='completed'
        )
        
        income = transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        expenses = transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        profit = income - expenses
        
        # Category breakdown
        income_by_cat = transactions.filter(transaction_type='income').values(
            'category__name'
        ).annotate(total=Sum('amount')).order_by('-total')[:5]
        
        expense_by_cat = transactions.filter(transaction_type='expense').values(
            'category__name'
        ).annotate(total=Sum('amount')).order_by('-total')[:5]
        
        # Previous month comparison
        prev_month = current_month - timedelta(days=1)
        prev_month_start = prev_month.replace(day=1)
        prev_transactions = Transaction.objects.filter(
            user=user,
            transaction_date__gte=prev_month_start,
            transaction_date__lt=current_month,
            status='completed'
        )
        prev_income = prev_transactions.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        prev_expenses = prev_transactions.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        
        prompt = f"""
You are a Business Advisor AI for SMEs. Analyze this business data and provide insights:

Current Month Performance:
- Revenue: ${float(income):,.2f}
- Expenses: ${float(expenses):,.2f}
- Net Profit: ${float(profit):,.2f}
- Profit Margin: {(profit/income*100) if income > 0 else 0:.1f}%

Previous Month:
- Revenue: ${float(prev_income):,.2f}
- Expenses: ${float(prev_expenses):,.2f}

Top Revenue Sources: {list(income_by_cat)}
Top Expense Categories: {list(expense_by_cat)}

Provide:
1. Business health assessment
2. Cash flow insights
3. Cost optimization suggestions
4. Growth opportunities
5. Risk alerts (if any)

Be specific with numbers and actionable recommendations.
"""
        
        advice = call_openrouter_ai(prompt)
        
        # Save conversation
        Conversation.objects.create(
            user=user,
            message="Business performance analysis",
            response=advice,
            conversation_type='insight'
        )
        
        return Response({
            'advice': advice,
            'metrics': {
                'revenue': float(income),
                'expenses': float(expenses),
                'profit': float(profit),
                'profit_margin': (profit/income*100) if income > 0 else 0
            },
            'generated_at': timezone.now()
        })
        
    except Exception as e:
        print(f"AI Business Advisor Error: {str(e)}")
        return Response({
            'error': 'Unable to generate business advice',
            'fallback': f'Error: {str(e)}'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
