from django.urls import include, path
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'rooms', ChatRoomViewSet)
router.register(r'messages', ChatMessageViewSet)

urlpatterns = router.urls