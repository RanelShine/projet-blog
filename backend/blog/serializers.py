#blod/serializers.py
from rest_framework import serializers
from .models import Post
from comments.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    """Serializer pour les commentaires"""
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PostListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des articles (sans les commentaires)"""
    
    comments_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'is_favorite', 'created_at', 'updated_at', 'comments_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'comments_count']

class PostDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour les articles (avec les commentaires)"""
    
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'is_favorite', 'created_at', 'updated_at', 'comments', 'comments_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'comments_count']

class PostCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la création et modification des articles"""
    
    class Meta:
        model = Post
        fields = ['title', 'content', 'is_favorite']
        
    def validate_title(self, value):
        """Validation personnalisée pour le titre"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Le titre doit contenir au moins 5 caractères.")
        return value.strip()
    
    def validate_content(self, value):
        """Validation personnalisée pour le contenu"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Le contenu doit contenir au moins 10 caractères.")
        return value.strip()