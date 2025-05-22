from rest_framework import generics, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Comment
from blog.models import Post
from .serializers import CommentCreateSerializer, CommentDetailSerializer

class CommentPagination(PageNumberPagination):
    """Pagination personnalisée pour les commentaires"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class CommentListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister tous les commentaires et créer un nouveau commentaire
    GET /api/comments/ - Liste tous les commentaires
    POST /api/comments/ - Crée un nouveau commentaire
    """
    queryset = Comment.objects.all()
    pagination_class = CommentPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['author', 'content']
    ordering_fields = ['created_at', 'author']
    ordering = ['-created_at']  # Tri par défaut par date décroissante
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentDetailSerializer
    
    def perform_create(self, serializer):
        """Actions personnalisées lors de la création d'un commentaire"""
        serializer.save()

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer un commentaire spécifique
    GET /api/comments/{id}/ - Récupère un commentaire
    PUT /api/comments/{id}/ - Met à jour un commentaire
    PATCH /api/comments/{id}/ - Met à jour partiellement un commentaire
    DELETE /api/comments/{id}/ - Supprime un commentaire
    """
    queryset = Comment.objects.all()
    serializer_class = CommentDetailSerializer

@api_view(['GET'])
def post_comments(request, post_id):
    """
    Vue pour récupérer tous les commentaires d'un article spécifique
    GET /api/posts/{post_id}/comments/
    """
    post = get_object_or_404(Post, pk=post_id)
    comments = Comment.objects.filter(post=post)
    
    # Pagination
    paginator = CommentPagination()
    page = paginator.paginate_queryset(comments, request)
    
    if page is not None:
        serializer = CommentDetailSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = CommentDetailSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_comment_to_post(request, post_id):
    """
    Vue pour ajouter un commentaire à un article spécifique
    POST /api/posts/{post_id}/comments/
    """
    post = get_object_or_404(Post, pk=post_id)
    
    # Préparer les données avec l'ID du post
    data = request.data.copy()
    data['post'] = post.id
    
    serializer = CommentCreateSerializer(data=data)
    if serializer.is_valid():
        comment = serializer.save()
        response_serializer = CommentDetailSerializer(comment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def comment_stats(request):
    """
    Vue pour obtenir des statistiques sur les commentaires
    GET /api/comments/stats/
    """
    total_comments = Comment.objects.count()
    
    # Commentaires par article (top 5)
    posts_with_most_comments = (
        Post.objects
        .annotate(comment_count=models.Count('comments'))
        .order_by('-comment_count')[:5]
    )
    
    top_posts = []
    for post in posts_with_most_comments:
        top_posts.append({
            'post_id': post.id,
            'post_title': post.title,
            'comment_count': post.comment_count
        })
    
    return Response({
        'total_comments': total_comments,
        'top_commented_posts': top_posts
    })