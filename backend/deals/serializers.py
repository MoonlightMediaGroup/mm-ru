# deals/serializers.py
from rest_framework import serializers
from .models import Deal
from users.serializers import UserSerializer
from services.serializers import ServiceSerializer, WorkSerializer

class DealSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    work = WorkSerializer(read_only=True)

    class Meta:
        model = Deal
        fields = ['id', 'buyer', 'seller', 'service', 'work', 'price', 'status', 'created_at', 'updated_at']