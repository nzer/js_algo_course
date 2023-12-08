from django.shortcuts import render

from django.db.models import F
from django.db.models.functions import ACos, Cos, Radians, Sin

# Create your views here.
from django.contrib.auth.models import Group, User
from .models import ChatRoom, ChatMessage
from rest_framework import permissions, viewsets

from .serializers import GroupSerializer, UserSerializer, ChatRoomSerializer, ChatMessageSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        input_latitude = float(self.request.GET.get('lat', 0))
        input_longitude = float(self.request.GET.get('long', 0))
        locations = ChatRoom.objects.annotate(
        distance_miles = ACos(
            Cos(
                Radians(input_latitude)
            ) * Cos(
                Radians(F('lat'))
            ) * Cos(
                Radians(F('long')) - Radians(input_longitude)
            ) + Sin(
                Radians(input_latitude)
            ) * Sin(Radians(F('lat')))
        ) * 3959
        ).order_by('distance_miles')[:10]
        return locations

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.GET.get('roomId')
        if room_id is not None:
            return ChatMessage.objects.filter(room__id = room_id)
        return ChatMessage.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)