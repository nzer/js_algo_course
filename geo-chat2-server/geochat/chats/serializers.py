from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import ChatRoom, ChatMessage

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ChatRoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['room_name', 'lat', 'long']


class ChatMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['room', 'message', 'pub_date', 'created_by']