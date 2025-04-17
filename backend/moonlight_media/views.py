# moonlight_media/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from posts.models import Post
from users.models import User
from posts.serializers import PostSerializer
from users.serializers import UserSerializer
from django.db.models import Count, Q
from datetime import timedelta
from django.utils import timezone

class HomepageView(APIView):
    def get(self, request):
        # Интересные посты (сортировка по лайкам и просмотрам)
        trending_posts = Post.objects.annotate(
            like_count=Count('likes')
        ).order_by('-like_count', '-views')[:10]
        
        # Топ продавцов (по рейтингу и продажам)
        top_sellers = User.objects.filter(
            total_sales__gt=0
        ).order_by('-rating', '-total_sales')[:5]
        
        # Топ новичков (зарегистрированы недавно)
        one_month_ago = timezone.now() - timedelta(days=30)
        top_newcomers = User.objects.filter(
            created_at__gte=one_month_ago
        ).order_by('-rating')[:5]
        
        return Response({
            'trending_posts': PostSerializer(trending_posts, many=True).data,
            'top_sellers': UserSerializer(top_sellers, many=True).data,
            'top_newcomers': UserSerializer(top_newcomers, many=True).data,
        })