#comments/admin.py
from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Configuration de l'admin pour les commentaires"""
    
    list_display = ['author', 'post', 'content_preview', 'created_at']
    list_filter = ['created_at', 'post']
    search_fields = ['author', 'content', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('post', 'author', 'content')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def content_preview(self, obj):
        """Affiche un aperçu du contenu du commentaire"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Aperçu du contenu'
    
    def get_queryset(self, request):
        """Optimise les requêtes en incluant les relations"""
        return super().get_queryset(request).select_related('post')