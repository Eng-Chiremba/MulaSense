from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'auto-payments', views.AutomaticBillPaymentViewSet, basename='auto-payment')
router.register(r'payments', views.EcoCashPaymentViewSet, basename='ecocash-payment')

urlpatterns = [
    path('', include(router.urls)),
    path('test/', views.test_connection, name='test-connection'),
    path('send-money/', views.send_money, name='send-money'),
    path('buy-airtime/', views.buy_airtime, name='buy-airtime'),
    path('pay-merchant/', views.pay_merchant, name='pay-merchant'),
    path('manual-payment/', views.manual_payment, name='manual-payment'),
    path('callback/', views.callback, name='ecocash-callback'),
    path('payment-status/<uuid:source_reference>/', views.payment_status, name='payment-status'),
]