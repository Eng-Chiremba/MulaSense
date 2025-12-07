from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('refresh-token/', views.refresh_token, name='refresh-token'),
    path('verify-token/', views.verify_token, name='verify-token'),
    path('password-reset/', views.password_reset_request, name='password-reset'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password-reset-confirm'),
    
    # Users
    path('', views.UserListCreateView.as_view(), name='user-list-create'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # User Profiles
    path('profiles/', views.UserProfileListCreateView.as_view(), name='profile-list-create'),
    path('profiles/<int:pk>/', views.UserProfileDetailView.as_view(), name='profile-detail'),
    
    # Profile Management
    path('me/', views.current_user, name='current-user'),
    path('me/update/', views.update_user, name='update-user'),
    path('me/profile/', views.CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('me/change-password/', views.change_password, name='change-password'),
]