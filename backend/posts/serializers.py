# posts/serializers.py
from rest_framework import serializers
from .models import Post, Like, Comment, CommentLike, View
from users.models import User
from users.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    views_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'created_at', 'likes_count', 'comments_count', 'views_count']
        extra_kwargs = {'title': {'required': False}}

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    parent = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), allow_null=True)
    has_liked = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    popularity_score = serializers.IntegerField(read_only=True)  # Аннотированное поле

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at', 'parent', 'has_liked', 'likes_count', 'popularity_score']

    def get_has_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'comment', 'created_at']

class ViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = View
        fields = ['id', 'user', 'post', 'created_at']