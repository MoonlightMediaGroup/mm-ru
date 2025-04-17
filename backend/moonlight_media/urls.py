# moonlight_media/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, ReviewViewSet, SubscriptionViewSet, TelegramLoginView, TransactionViewSet
from posts.views import PostViewSet, CommentViewSet
from services.views import ServiceViewSet, WorkViewSet
from deals.views import DealViewSet
from chats.views import ChatViewSet, MessageViewSet
from .views import HomepageView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'works', WorkViewSet)
router.register(r'deals', DealViewSet)
router.register(r'chats', ChatViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/home/', HomepageView.as_view(), name='homepage'),
    path('api/auth/telegram/callback/', TelegramLoginView.as_view(), name='telegram-callback'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)