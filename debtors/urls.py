from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.debtor_summary, name='debtor-summary'),
    path('', views.debtor_list, name='debtor-list'),
    path('<int:pk>/payment/', views.record_payment, name='record-payment'),
    path('<int:pk>/', views.debtor_detail, name='debtor-detail'),
]
