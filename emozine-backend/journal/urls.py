from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet
from django.urls import include, path

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='entry')

urlpatterns = [
    path('', include(router.urls))
]