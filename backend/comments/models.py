from django.db import models
from django.utils import timezone
from blog.models import Post

class Comment(models.Model):
    """Modèle pour les commentaires des articles"""
    
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name="Article"
    )
    author = models.CharField(max_length=100, verbose_name="Auteur")
    content = models.TextField(verbose_name="Contenu")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Commentaire"
        verbose_name_plural = "Commentaires"
        ordering = ['-created_at']  # Tri par date décroissante
    
    def __str__(self):
        return f"Commentaire de {self.author} sur {self.post.title}"