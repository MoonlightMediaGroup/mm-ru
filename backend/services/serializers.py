# services/serializers.py
from rest_framework import serializers
from .models import Service, Work
from users.serializers import UserSerializer

class ServiceSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'seller', 'title', 'description', 'price', 'service_type', 'created_at', 'updated_at']

class WorkSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)

    class Meta:
        model = Work
        fields = ['id', 'seller', 'title', 'description', 'price', 'file', 'status', 'created_at', 'updated_at']