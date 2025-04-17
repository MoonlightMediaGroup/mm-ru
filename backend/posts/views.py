# posts/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, F, Value, IntegerField
from .models import Post, Like, Comment, CommentLike, View
from .serializers import PostSerializer, LikeSerializer, CommentSerializer, CommentLikeSerializer, ViewSerializer

class CommentPagination(PageNumberPagination):
    page_size = 5

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['author__username']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            like.delete()
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)
        return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def view(self, request, pk=None):
        post = self.get_object()
        user = request.user
        today = timezone.now().date()
        start_of_day = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
        end_of_day = start_of_day + timedelta(days=1)

        views_today = View.objects.filter(
            user=user,
            post=post,
            created_at__range=(start_of_day, end_of_day)
        ).count()

        if views_today >= 5:
            return Response({'status': 'view_limit_reached'}, status=status.HTTP_400_BAD_REQUEST)

        view, created = View.objects.get_or_create(
            user=user,
            post=post,
            created_at__range=(start_of_day, end_of_day),
            defaults={'created_at': timezone.now()}
        )
        if created:
            post.views_count += 1
            post.save()
            return Response({'status': 'viewed'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already_viewed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def like_status(self, request, pk=None):
        post = self.get_object()
        user = request.user
        has_liked = Like.objects.filter(user=user, post=post).exists()
        return Response({'has_liked': has_liked}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['post']
    pagination_class = CommentPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering = self.request.query_params.get('ordering', 'popularity_score')

        queryset = queryset.annotate(
            replies_count=Count('replies'),
            popularity_score=F('likes_count') + F('replies_count')
        )

        if ordering == 'popularity_score':
            return queryset.order_by('-popularity_score', '-created_at')
        return queryset.order_by(ordering)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        comment = self.get_object()
        user = request.user
        like, created = CommentLike.objects.get_or_create(user=user, comment=comment)
        if created:
            comment.likes_count += 1
        else:
            like.delete()
            comment.likes_count -= 1
        comment.save()
        return Response({'status': 'liked' if created else 'unliked'}, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)