from django.urls import path
from . import views

urlpatterns = [
    # Chatbot
    path('chat/', views.chat_with_ai, name='ai-chat'),
    path('conversations/', views.conversation_history, name='conversation-history'),
    
    # Financial Insights
    path('insights/', views.generate_financial_insights, name='financial-insights'),
    
    # Recommendations
    path('recommendations/', views.get_recommendations, name='ai-recommendations'),
    
    # Business Advisor
    path('business-advisor/', views.business_advisor, name='business-advisor'),
]