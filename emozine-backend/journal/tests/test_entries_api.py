import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from journal.models import JournalEntry

"""
Test for the JournalEntry API(list, create, update and delete) to ensure users
only see and modify their own entries.
"""

User = get_user_model()

ENTRIES_URL = "/api/entries/"

def create_user(username="user", password="testpass123"):
    """
    This is a tiny helper to create a user with a default password.
    It will reduce redundant code in the test function.
    """
    return User.objects.create_user(username=username, password=password)

def create_authenticated_client(user):
    client = APIClient()
    client.force_authenticate(user=user)

    return client

# --- List tests ---

@pytest.mark.django_db
def test_list_entries_requires_authentication():
    """
    Unauthenticated clients should not see any entries and get 401 Unauthorized.
    """
    client = APIClient()
    response = client.get(ENTRIES_URL)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_list_entries_return_only_authenticated_users_entries():
    """
    Authenticated clients can only see their oewn entries not others.
    """
    user = create_user(username='user')
    other_user = create_user(username='other')

    my_entry_1 = JournalEntry.objects.create(
        user=user,
        content="My first entry",
        emoji="😊",
    )
    my_entry_2 = JournalEntry.objects.create(
        user=user,
        content="My second entry",
        emoji="😌",
    )
    other_entry = JournalEntry.objects.create(
        user=other_user,
        content="Other user's entry",
        emoji="😐",
    )

    client = create_authenticated_client(user)

    response = client.get(ENTRIES_URL)

    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 2

    returned_ids = {item['id'] for item in data}
    assert my_entry_1.id in returned_ids
    assert my_entry_2.id in returned_ids
    assert other_entry.id not in returned_ids

# --- Create tests ---

@pytest.mark.django_db
def test_create_entry_authenticated_user():
    """
    Authenticated user can create a journal entry and it is linked to that user.
    """
    user = create_user(username='user1')

    client = create_authenticated_client(user)

    payload = {
        "content": "Today I wrote my first test-backend entry.",
        "emoji": "😊",
    }

    response = client.post(ENTRIES_URL, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED

    assert JournalEntry.objects.count() == 1
    entry = JournalEntry.objects.first()

    assert entry.content == payload["content"]
    assert entry.emoji == payload["emoji"]

    assert entry.user == user

    data = response.json()
    assert data["id"] == entry.id
    assert data["content"] == payload["content"]
    assert data["emoji"] == payload["emoji"]

# --- Update tests ---

@pytest.mark.django_db
def test_update_entry_authenticated_user_can_update_own_entry():
    user = create_user(username='user')
    entry = JournalEntry.objects.create(user=user, content="Old content", emoji="😊")

    client = create_authenticated_client(user)

    payload = {
        "content": "Updated content",
        "emoji": "😌",
    }

    url = f"{ENTRIES_URL}{entry.id}/"
    response = client.put(url, payload, format="json")

    assert response.status_code == status.HTTP_200_OK

    entry.refresh_from_db()
    assert entry.content == payload["content"]
    assert entry.emoji == payload["emoji"]

@pytest.mark.django_db
def test_update_entry_cannot_update_someone_elses_entry():
    user = create_user(username='user')
    someone = create_user(username='someone')
    entry = JournalEntry.objects.create(user=user, content="user's content", emoji='😊')

    client = create_authenticated_client(someone)

    payload = {
        "content": "someone else's content",
        "emoji": "😌"
    }

    url = f"{ENTRIES_URL}{entry.id}/"
    response = client.put(url, payload, format='json')

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert entry.content == "user's content"
    assert entry.emoji == '😊'
    assert JournalEntry.objects.count() == 1

# --- Delete tests ---

@pytest.mark.django_db
def test_delete_entry_authenticated_user_can_delete_own_entry():
    """
    Deleting the authenticated user's own entry should return HTTP 204 No Content.
    """
    user = create_user(username='user')
    entry = JournalEntry.objects.create(user=user, content="user's content", emoji='😊')

    client = create_authenticated_client(user)

    url = f"{ENTRIES_URL}{entry.id}/"
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert JournalEntry.objects.filter(id=entry.id).exists() is False

@pytest.mark.django_db
def test_delete_entry_cannot_delete_someone_elses_entry():
    """
    Deleting another user's entry should behave as "not found" (404).

    We filter the queryset by the authenticated user in the viewset,
    so when "someone" tries to delete "user"'s entry, DRF cannot find the object
    in their filtered queryset and returns 404 Not Found instead of 403 Forbidden.
    This hides whether the entry ID is valid for another user.
    """
    user = create_user(username='user')
    someone = create_user(username='someone')
    entry = JournalEntry.objects.create(user=user, content="user's content", emoji='😊')

    client = create_authenticated_client(someone)

    url = f"{ENTRIES_URL}{entry.id}/"
    response = client.delete(url)

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert entry.content == "user's content"
    assert entry.emoji == '😊'
    assert JournalEntry.objects.filter(user=user).count() == 1