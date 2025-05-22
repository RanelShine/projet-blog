from django.urls import path
from . import views
from comments.views import post_comments,add_comment_to_post


app_name = 'blog'

urlpatterns = [
    # URLs pour les articles
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/toggle-favorite/', views.toggle_favorite_post, name='toggle-favorite-post'),
    path('posts/favorites/', views.favorite_posts, name='favorite-posts'),
    path('posts/stats/', views.post_stats, name='post-stats'),
    
    # URLs pour les commentaires liés aux articles
    path('posts/<int:post_id>/comments/', post_comments, name='post-comments'),
    path('posts/<int:post_id>/comments/add/', add_comment_to_post, name='add-comment-to-post'),
]