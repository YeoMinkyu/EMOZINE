from rest_framework import serializers
from .models import JournalEntry

"""
A Serializer is like a translator between
Django Models ←→ JSON (for frontend/backend communication)

JournalEntry Model (Python object)
   ⇅  (convert)
Serializer
   ⇅
JSON data (for HTTP request/response)
"""

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = '__all__' # include all fields: user, content, emoji, created_at
        read_only_fields = ['user', 'created_at']