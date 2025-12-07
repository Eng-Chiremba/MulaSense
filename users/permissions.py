from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        return obj.user == request.user

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners to access their data.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission for admin users or data owners.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_staff:
            return True
        
        # Regular users can only access their own data
        return hasattr(obj, 'user') and obj.user == request.user

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission for admin-only access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsOwnerProfile(permissions.BasePermission):
    """
    Permission for user profile access.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user