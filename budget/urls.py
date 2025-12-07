from django.urls import path
from . import views

urlpatterns = [
    # Debug
    path('debug/current-user/', views.current_user_info, name='current-user-info'),
    
    # Budget Categories
    path('categories/', views.BudgetCategoryListCreateView.as_view(), name='budget-category-list-create'),
    path('categories/<int:pk>/', views.BudgetCategoryDetailView.as_view(), name='budget-category-detail'),
    
    # Goals
    path('goals/', views.GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', views.GoalDetailView.as_view(), name='goal-detail'),
    path('goals/<int:goal_id>/contribute/', views.add_goal_contribution, name='add-goal-contribution'),
    
    # Goal Contributions
    path('contributions/', views.GoalContributionListCreateView.as_view(), name='contribution-list-create'),
    path('contributions/<int:pk>/', views.GoalContributionDetailView.as_view(), name='contribution-detail'),
    
    # Analytics
    path('analytics/overview/', views.budget_overview, name='budget-overview'),
    path('analytics/categories/', views.category_analytics, name='category-analytics'),
    path('analytics/goals/', views.goal_analytics, name='goal-analytics'),
]