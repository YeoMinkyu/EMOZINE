from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    emoji = models.CharField(max_length=10, blank=True)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.date()}"