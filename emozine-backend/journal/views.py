from django.shortcuts import render
from rest_framework import viewsets
from .models import JournalEntry
from .serializers import JournalEntrySerializer


# Create your views here.
class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
