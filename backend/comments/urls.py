from django.urls import path
from . import views

app_name = 'comments'

urlpatterns = [
    # URLs pour les commentaires
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('comments/stats/', views.comment_stats, name='comment-stats'),
]