from rest_framework import generics, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Post
from .serializers import (
    PostListSerializer, 
    PostDetailSerializer, 
    PostCreateUpdateSerializer
)

class PostPagination(PageNumberPagination):
    """Pagination personnalisée pour les articles"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class PostListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister tous les articles et créer un nouvel article
    GET /api/posts/ - Liste tous les articles
    POST /api/posts/ - Crée un nouvel article
    """
    queryset = Post.objects.all()
    pagination_class = PostPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title', 'is_favorite']
    ordering = ['-created_at']  # Tri par défaut par date décroissante
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer
        return PostListSerializer
    
    def get_queryset(self):
        """Filtrage personnalisé des articles"""
        queryset = Post.objects.all()
        
        # Filtre par favoris
        is_favorite = self.request.query_params.get('is_favorite', None)
        if is_favorite is not None:
            is_favorite_bool = is_favorite.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(is_favorite=is_favorite_bool)
        
        # Recherche avancée (titre ET contenu)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(content__icontains=search_query)
            )
        
        return queryset

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer un article spécifique
    GET /api/posts/{id}/ - Récupère un article
    PUT /api/posts/{id}/ - Met à jour un article
    PATCH /api/posts/{id}/ - Met à jour partiellement un article
    DELETE /api/posts/{id}/ - Supprime un article
    """
    queryset = Post.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostDetailSerializer

@api_view(['PATCH'])
def toggle_favorite_post(request, pk):
    """
    Vue pour basculer le statut favori d'un article
    PATCH /api/posts/{id}/toggle-favorite/
    """
    post = get_object_or_404(Post, pk=pk)
    post.is_favorite = not post.is_favorite
    post.save()
    
    serializer = PostDetailSerializer(post)
    return Response({
        'message': f'Article {"ajouté aux" if post.is_favorite else "retiré des"} favoris',
        'post': serializer.data
    })

@api_view(['GET'])
def favorite_posts(request):
    """
    Vue pour récupérer tous les articles favoris
    GET /api/posts/favorites/
    """
    favorite_posts = Post.objects.filter(is_favorite=True)
    
    # Pagination
    paginator = PostPagination()
    page = paginator.paginate_queryset(favorite_posts, request)
    
    if page is not None:
        serializer = PostListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = PostListSerializer(favorite_posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def post_stats(request):
    """
    Vue pour obtenir des statistiques sur les articles
    GET /api/posts/stats/
    """
    total_posts = Post.objects.count()
    favorite_posts = Post.objects.filter(is_favorite=True).count()
    
    return Response({
        'total_posts': total_posts,
        'favorite_posts': favorite_posts,
        'regular_posts': total_posts - favorite_posts
    })