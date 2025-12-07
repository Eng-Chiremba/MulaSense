from rest_framework import serializers
from .models import Conversation

class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)
    response = serializers.CharField(read_only=True)

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'message', 'response', 'conversation_type', 'created_at']
        read_only_fields = ['created_at']