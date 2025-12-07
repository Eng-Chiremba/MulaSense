from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_conversations')
    message = models.TextField()
    response = models.TextField()
    conversation_type = models.CharField(max_length=20, choices=[
        ('chat', 'Chat'),
        ('insight', 'Financial Insight'),
        ('recommendation', 'Recommendation')
    ], default='chat')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_conversations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.conversation_type} - {self.created_at}"
