from rest_framework import permissions

class IsBudgetOwner(permissions.BasePermission):
    """
    Permission to only allow budget owners to access their budget data.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsGoalOwner(permissions.BasePermission):
    """
    Permission to only allow goal owners to access their goals.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsGoalContributionOwner(permissions.BasePermission):
    """
    Permission to only allow goal owners to access their goal contributions.
    """
    def has_object_permission(self, request, view, obj):
        return obj.goal.user == request.user