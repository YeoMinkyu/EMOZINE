from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet
from django.urls import include, path

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='entry')

"""
DRF’s router matches POST /api/entries/ to the create() action of JournalEntryViewSet.
"""

urlpatterns = [
    path('', include(router.urls))
]