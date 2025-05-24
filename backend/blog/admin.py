#blog/admin.py
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Configuration de l'admin pour les articles"""
    
    list_display = ['title', 'is_favorite', 'comments_count', 'created_at', 'updated_at']
    list_filter = ['is_favorite', 'created_at', 'updated_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at', 'comments_count']
    list_editable = ['is_favorite']
    list_per_page = 20
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'content')
        }),
        ('Options', {
            'fields': ('is_favorite',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Statistiques', {
            'fields': ('comments_count',),
            'classes': ('collapse',)
        })
    )
    
    def comments_count(self, obj):
        """Affiche le nombre de commentaires dans l'admin"""
        return obj.comments_count
    comments_count.short_description = 'Nb commentaires'
    
    actions = ['make_favorite', 'remove_favorite']
    
    def make_favorite(self, request, queryset):
        """Action pour marquer les articles comme favoris"""
        updated = queryset.update(is_favorite=True)
        self.message_user(request, f'{updated} article(s) marqué(s) comme favori(s).')
    make_favorite.short_description = "Marquer comme favori"
    
    def remove_favorite(self, request, queryset):
        """Action pour retirer les articles des favoris"""
        updated = queryset.update(is_favorite=False)
        self.message_user(request, f'{updated} article(s) retiré(s) des favoris.')
    remove_favorite.short_description = "Retirer des favoris"