"""
URL configuration for blog_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    """
    Point d'entrée de l'API avec la liste des endpoints disponibles
    """
    return Response({
        'message': 'Bienvenue sur l\'API Blog !',
        'version': '1.0.0',
        'endpoints': {
            'posts': {
                'list_create': '/api/posts/',
                'detail': '/api/posts/{id}/',
                'toggle_favorite': '/api/posts/{id}/toggle-favorite/',
                'favorites': '/api/posts/favorites/',
                'stats': '/api/posts/stats/',
                'comments': '/api/posts/{id}/comments/',
                'add_comment': '/api/posts/{id}/comments/add/',
            },
            'comments': {
                'list_create': '/api/comments/',
                'detail': '/api/comments/{id}/',
                'stats': '/api/comments/stats/',
            },
            'admin': '/admin/',
            'api_docs': '/api/docs/',
        },
        'search_parameters': {
            'posts': '?search=terme&is_favorite=true&ordering=-created_at',
            'comments': '?search=terme&ordering=-created_at',
        },
        'pagination': {
            'posts': 'page_size=10 (max 50)',
            'comments': 'page_size=20 (max 100)',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include('blog.urls')),
    path('api/', include('comments.urls')),
]

