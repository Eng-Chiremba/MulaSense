from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'auto-payments', views.AutomaticBillPaymentViewSet, basename='auto-payment')
router.register(r'payments', views.EcoCashPaymentViewSet, basename='ecocash-payment')

urlpatterns = [
    path('', include(router.urls)),
    path('manual-payment/', views.manual_payment, name='manual-payment'),
    path('callback/', views.callback, name='ecocash-callback'),
]