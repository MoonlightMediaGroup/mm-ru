# users/serializers.py
from rest_framework import serializers
from .models import User, Review, Subscription, Transaction
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer

class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        user.is_active = True  # Активируем пользователя сразу
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'bio', 'avatar', 'banner', 'balance', 'is_verified', 'rating', 'total_sales', 'created_at', 'telegram_id', 'telegram_username']

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'recipient', 'rating', 'comment', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    subscriber = UserSerializer(read_only=True)
    subscribed_to = UserSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'subscriber', 'subscribed_to', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'transaction_type', 'status', 'created_at', 'external_id']