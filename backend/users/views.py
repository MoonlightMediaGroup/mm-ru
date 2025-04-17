# users/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Review, Subscription, Transaction
from .serializers import UserSerializer, ReviewSerializer, SubscriptionSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
import hashlib
import environ

env = environ.Env()

class TelegramLoginView(APIView):
    def post(self, request):
        # Данные от Telegram
        data = request.data
        telegram_id = data.get('id')
        telegram_username = data.get('username')
        auth_date = data.get('auth_date')
        hash_received = data.get('hash')

        # Проверка подписи (для безопасности)
        bot_token = env('TELEGRAM_BOT_TOKEN')
        data_check_string = '\n'.join([f'{k}={v}' for k, v in sorted(data.items()) if k != 'hash'])
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        hash_calculated = hashlib.sha256(data_check_string.encode()).hexdigest()

        if hash_calculated != hash_received:
            return Response({'error': 'Invalid Telegram data'}, status=status.HTTP_400_BAD_REQUEST)

        # Создаем или обновляем пользователя
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': telegram_username or f'tg_{telegram_id}',
                'telegram_username': telegram_username,
                'email': f'{telegram_id}@telegram.com',  # Временный email, можно запросить позже
            }
        )

        # Авторизуем пользователя
        login(request, user)
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        user = self.get_object()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(subscriber=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)