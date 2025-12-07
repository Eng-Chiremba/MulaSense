from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
from decimal import Decimal
from .models import BudgetCategory, Goal, GoalContribution
from .serializers import BudgetCategorySerializer, GoalSerializer, GoalContributionSerializer
from .permissions import IsBudgetOwner, IsGoalOwner, IsGoalContributionOwner

# Budget Category CRUD Views
class BudgetCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = BudgetCategory.objects.filter(user=self.request.user, is_active=True)
        print(f'Budget API - User: {self.request.user.username} (ID: {self.request.user.id})')
        print(f'Budget API - Queryset count: {queryset.count()}')
        return queryset
    
    def perform_create(self, serializer):
        print(f'Creating budget for user: {self.request.user.username}')
        serializer.save(user=self.request.user)

class BudgetCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [IsAuthenticated, IsBudgetOwner]
    
    def get_queryset(self):
        return BudgetCategory.objects.filter(user=self.request.user)

# Goal CRUD Views
class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated, IsGoalOwner]
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

# Goal Contribution CRUD Views
class GoalContributionListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalContributionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GoalContribution.objects.filter(goal__user=self.request.user)
    
    def perform_create(self, serializer):
        contribution = serializer.save()
        # Update goal's current amount
        goal = contribution.goal
        goal.current_amount += contribution.amount
        goal.save()

class GoalContributionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalContributionSerializer
    permission_classes = [IsAuthenticated, IsGoalContributionOwner]
    
    def get_queryset(self):
        return GoalContribution.objects.filter(goal__user=self.request.user)

# Goal Contribution Tracking
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_goal_contribution(request, goal_id):
    try:
        goal = Goal.objects.get(id=goal_id, user=request.user)
        amount = Decimal(str(request.data.get('amount', 0)))
        notes = request.data.get('notes', '')
        
        contribution = GoalContribution.objects.create(
            goal=goal,
            amount=amount,
            notes=notes
        )
        
        # Update goal current amount
        goal.current_amount += amount
        goal.save()
        
        return Response({
            'message': 'Contribution added successfully',
            'contribution_id': contribution.id,
            'goal_progress': goal.progress_percentage
        })
    except Goal.DoesNotExist:
        return Response({'error': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Budget Analytics Endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_info(request):
    """Debug endpoint to check current authenticated user"""
    user = request.user
    budgets = BudgetCategory.objects.filter(user=user, is_active=True)
    return Response({
        'user_id': user.id,
        'username': user.username,
        'budget_count': budgets.count(),
        'budgets': [{'id': b.id, 'name': b.name, 'amount': b.budgeted_amount} for b in budgets]
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_overview(request):
    categories = BudgetCategory.objects.filter(user=request.user, is_active=True)
    goals = Goal.objects.filter(user=request.user, status='active')
    
    total_budgeted = categories.aggregate(Sum('budgeted_amount'))['budgeted_amount__sum'] or 0
    total_spent = categories.aggregate(Sum('spent_amount'))['spent_amount__sum'] or 0
    total_remaining = total_budgeted - total_spent
    
    active_goals = goals.count()
    total_goal_target = goals.aggregate(Sum('target_amount'))['target_amount__sum'] or 0
    total_goal_current = goals.aggregate(Sum('current_amount'))['current_amount__sum'] or 0
    
    return Response({
        'budget_summary': {
            'total_budgeted': total_budgeted,
            'total_spent': total_spent,
            'total_remaining': total_remaining,
            'spending_percentage': (total_spent / total_budgeted * 100) if total_budgeted > 0 else 0
        },
        'goals_summary': {
            'active_goals': active_goals,
            'total_target': total_goal_target,
            'total_saved': total_goal_current,
            'overall_progress': (total_goal_current / total_goal_target * 100) if total_goal_target > 0 else 0
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_analytics(request):
    categories = BudgetCategory.objects.filter(user=request.user, is_active=True)
    
    category_data = []
    for category in categories:
        category_data.append({
            'id': category.id,
            'name': category.name,
            'budgeted': category.budgeted_amount,
            'spent': category.spent_amount,
            'remaining': category.remaining_amount,
            'percentage_used': category.percentage_used,
            'status': 'over_budget' if category.spent_amount > category.budgeted_amount else 'on_track'
        })
    
    return Response({'categories': category_data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def goal_analytics(request):
    goals = Goal.objects.filter(user=request.user)
    
    goal_data = []
    for goal in goals:
        recent_contributions = GoalContribution.objects.filter(goal=goal).order_by('-contribution_date')[:5]
        
        goal_data.append({
            'id': goal.id,
            'name': goal.name,
            'target_amount': goal.target_amount,
            'current_amount': goal.current_amount,
            'progress_percentage': goal.progress_percentage,
            'days_remaining': goal.days_remaining,
            'status': goal.status,
            'recent_contributions': [{
                'amount': contrib.amount,
                'date': contrib.contribution_date,
                'notes': contrib.notes
            } for contrib in recent_contributions]
        })
    
    return Response({'goals': goal_data})
