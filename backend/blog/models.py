#blog/models.py
from django.db import models
from django.utils import timezone

class Post(models.Model):
    """Modèle pour les articles de blog"""
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    content = models.TextField(verbose_name="Contenu")
    is_favorite = models.BooleanField(default=False, verbose_name="Favori")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
        ordering = ['-created_at']  # Tri par date décroissante
    
    def __str__(self):
        return self.title
    
    @property
    def comments_count(self):
        """Retourne le nombre de commentaires pour cet article"""
        return self.comments.count()
    
    def get_recent_comments(self, limit=5):
        """Retourne les commentaires récents pour cet article"""
        return self.comments.order_by('-created_at')[:limit]