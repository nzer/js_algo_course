from django.db import models
from django.conf import settings

# Create your models here.

class ChatRoom(models.Model):
    room_name = models.CharField(max_length=50)
    lat = models.FloatField()
    long = models.FloatField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.room_name

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    message = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date created")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )