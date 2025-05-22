from rest_framework import serializers
from .models import Comment
from blog.models import Post

class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création de commentaires"""
    
    class Meta:
        model = Comment
        fields = ['post', 'author', 'content']
    
    def validate_author(self, value):
        """Validation personnalisée pour l'auteur"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom de l'auteur doit contenir au moins 2 caractères.")
        return value.strip()
    
    def validate_content(self, value):
        """Validation personnalisée pour le contenu"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Le commentaire doit contenir au moins 5 caractères.")
        return value.strip()
    
    def validate_post(self, value):
        """Validation que l'article existe"""
        if not Post.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("L'article spécifié n'existe pas.")
        return value

class CommentDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour les commentaires"""
    
    post_title = serializers.CharField(source='post.title', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'post_title', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'post', 'post_title', 'created_at', 'updated_at']