from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transfers', views.TransferViewSet, basename='transfer')

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', views.transfer_categories, name='transfer-categories'),
    path('exchange-rates/', views.exchange_rates, name='exchange-rates'),
    path('send-to-registered/', views.send_to_registered_user, name='send-to-registered'),
    path('send-to-unregistered/', views.send_to_unregistered_user, name='send-to-unregistered'),
    path('send-to-account/', views.send_to_account, name='send-to-account'),
    path('currency-exchange/', views.currency_exchange, name='currency-exchange'),
    path('history/', views.transfer_history, name='transfer-history'),
    path('detail/<uuid:reference>/', views.transfer_detail, name='transfer-detail'),
]