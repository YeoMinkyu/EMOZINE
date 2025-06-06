from django.shortcuts import render
from rest_framework import viewsets
from .models import JournalEntry
from .serializers import JournalEntrySerializer


# Create your views here.
class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        """
        DRF's list() implementation(Behind the scenes)
        def list(self, request, *args, **kwargs):
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        - `self.get_queryset()` returns your filtered queryset
        - `self.get_serializer(queryset, many=True)` calls my declared serializer(JournalEntrySerializer) with all the entries
        - `.data` on the serializer automactically turns the queryset into Python data(lists, dics) ready for JSON.
        - `Response(serializer.data)` wraps that in an HTTP response, and DRF automatically turns that Python data into JSON for you.

        And DRF handled all of this:
        - Receiving the GET request
        - Getting the correct data from DB
        - Using the serializer to turn Django models into Python lists/dicts
        - Using the renderer to turn that data into JSON
        - Sending the HTTP response back to my frontend
        """
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        DRF's create() implementation(Behind the scenes)
        def create(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        - `self.get_serializer(data=request.data)` instantiate your `JournalEntrySerializer` with POST data
        - `serializer.is_valid(raise_exception=True) checks if the submitted data fits the rules defined in the serializer and model.(If not, raise a 400 error and sent error details to the frontend)
        - `self.perform_create(serializer) By default: `serializer.save()` creates a new `JournalEntry` object in the DB.
        - `Response(serializer.data, status=201)` serializes the newly created entry and sends it back as JSON.
        """
        serializer.save(user=self.request.user)
