import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>
              <i class="fas fa-heart text-danger me-2"></i>
              Mes articles favoris
              <span class="badge bg-danger ms-2" *ngIf="!loading">{{ filteredFavorites.length }}</span>
            </h1>
            <div>
              <a routerLink="/posts" class="btn btn-primary me-2">
                <i class="fas fa-plus me-1"></i>
                Tous les articles
              </a>
              <button 
                class="btn btn-outline-danger" 
                *ngIf="favorites.length > 0"
                (click)="clearAllFavorites()"
                title="Vider tous les favoris">
                <i class="fas fa-trash me-1"></i>
                Vider les favoris
              </button>
            </div>
          </div>

          <!-- Filtres et recherche -->
          <div class="card mb-4" *ngIf="!loading && favorites.length > 0">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="searchTerm" class="form-label">Rechercher dans vos favoris</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="searchTerm"
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="applyFilters()"
                    placeholder="Rechercher par titre ou contenu...">
                </div>
                <div class="col-md-3">
                  <label for="statusFilter" class="form-label">Statut</label>
                  <select 
                    class="form-select" 
                    id="statusFilter"
                    [(ngModel)]="statusFilter"
                    (ngModelChange)="applyFilters()">
                    <option value="all">Tous</option>
                    <option value="published">Publiés</option>
                    <option value="draft">Brouillons</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="sortBy" class="form-label">Trier par</label>
                  <select 
                    class="form-select" 
                    id="sortBy"
                    [(ngModel)]="sortBy"
                    (ngModelChange)="applyFilters()">
                    <option value="date_desc">Plus récents</option>
                    <option value="date_asc">Plus anciens</option>
                    <option value="title">Titre A-Z</option>
                    <option value="comments">Plus commentés</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>

          <div *ngIf="!loading && favorites.length === 0" class="text-center py-5">
            <div class="alert alert-info">
              <i class="fas fa-heart-broken fa-2x mb-3"></i>
              <h4>Aucun article favori</h4>
              <p class="mb-3">Vous n'avez pas encore ajouté d'articles à vos favoris.</p>
              <a routerLink="/posts" class="btn btn-primary">
                <i class="fas fa-search me-1"></i>
                Découvrir des articles
              </a>
            </div>
          </div>

          <div *ngIf="!loading && favorites.length > 0 && filteredFavorites.length === 0" class="text-center py-5">
            <div class="alert alert-warning">
              <i class="fas fa-search fa-2x mb-3"></i>
              <h4>Aucun résultat</h4>
              <p>Aucun article favori ne correspond à vos critères de recherche.</p>
              <button class="btn btn-outline-primary" (click)="clearFilters()">
                <i class="fas fa-times me-1"></i>
                Effacer les filtres
              </button>
            </div>
          </div>

          <!-- Actions de sélection multiple -->
          <div class="card mb-3" *ngIf="selectedPosts.length > 0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  <strong>{{ selectedPosts.length }}</strong> article(s) sélectionné(s)
                </span>
                <div>
                  <button 
                    class="btn btn-danger btn-sm me-2"
                    (click)="removeSelectedFromFavorites()">
                    <i class="fas fa-heart-broken me-1"></i>
                    Retirer des favoris
                  </button>
                  <button 
                    class="btn btn-outline-danger btn-sm me-2"
                    (click)="deleteSelectedPosts()">
                    <i class="fas fa-trash me-1"></i>
                    Supprimer
                  </button>
                  <button 
                    class="btn btn-secondary btn-sm"
                    (click)="clearSelection()">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="row" *ngIf="!loading && filteredFavorites.length > 0">
            <!-- Sélection globale -->
            <div class="col-12 mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="selectAll"
                  [checked]="isAllSelected()"
                  [indeterminate]="isSomeSelected()"
                  (change)="toggleSelectAll()">
                <label class="form-check-label" for="selectAll">
                  Tout sélectionner
                </label>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-4" *ngFor="let post of filteredFavorites; trackBy: trackByPostId">
              <div class="card h-100 shadow-sm" [class.border-primary]="isSelected(post.id)">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        [checked]="isSelected(post.id)"
                        (change)="toggleSelection(post.id)">
                    </div>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      (click)="removeFromFavorites(post)"
                      title="Retirer des favoris">
                      <i class="fas fa-heart"></i>
                    </button>
                  </div>
                  
                  <h5 class="card-title">
                    <a [routerLink]="['/posts', post.id]" class="text-decoration-none">
                      {{ post.title }}
                    </a>
                    <span class="badge bg-secondary ms-2" *ngIf="!post.is_published">
                      Brouillon
                    </span>
                  </h5>
                  
                  <p class="card-text text-muted">
                    {{ getContentPreview(post.content) }}
                  </p>
                  
                  <div class="d-flex justify-content-between align-items-center text-muted">
                    <small>
                      <i class="fas fa-calendar me-1"></i>
                      {{ post.created_at | date:'dd/MM/yyyy' }}
                    </small>
                    <small>
                      <i class="fas fa-comments me-1"></i>
                      {{ post.comments_count }} commentaire(s)
                    </small>
                  </div>
                  
                  <!-- Tags/Catégories si disponibles -->
                  <div class="mt-2" *ngIf="post.category">
                    <span class="badge bg-light text-dark">
                      <i class="fas fa-tag me-1"></i>
                      {{ post.category }}
                    </span>
                  </div>
                </div>
                
                <div class="card-footer bg-transparent">
                  <div class="d-flex justify-content-between">
                    <a [routerLink]="['/posts', post.id]" class="btn btn-sm btn-outline-primary">
                      <i class="fas fa-eye me-1"></i>
                      Lire
                    </a>
                    <div>
                      <a [routerLink]="['/posts', post.id, 'edit']" class="btn btn-sm btn-outline-secondary me-2">
                        <i class="fas fa-edit"></i>
                      </a>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        (click)="deletePost(post)"
                        title="Supprimer l'article">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="row mt-4" *ngIf="!loading && favorites.length > 0">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="fas fa-chart-bar me-2"></i>
                    Statistiques de vos favoris
                  </h5>
                  <div class="row text-center">
                    <div class="col-md-2">
                      <div class="border-end">
                        <h3 class="text-danger">{{ favorites.length }}</h3>
                        <small class="text-muted">Total favoris</small>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="border-end">
                        <h3 class="text-primary">{{ filteredFavorites.length }}</h3>
                        <small class="text-muted">Affichés</small>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="border-end">
                        <h3 class="text-success">{{ getPublishedCount() }}</h3>
                        <small class="text-muted">Publiés</small>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="border-end">
                        <h3 class="text-warning">{{ getDraftCount() }}</h3>
                        <small class="text-muted">Brouillons</small>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="border-end">
                        <h3 class="text-info">{{ getTotalComments() }}</h3>
                        <small class="text-muted">Commentaires</small>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <h3 class="text-secondary">{{ getAverageComments() }}</h3>
                      <small class="text-muted">Moy. commentaires</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FavoritesComponent implements OnInit {
  favorites: Post[] = [];
  filteredFavorites: Post[] = [];
  selectedPosts: number[] = [];
  loading = true;

  // Filtres
  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'date_desc';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.postService.getFavoritePosts().subscribe({
      next: (response: any) => {
        // If response is paginated, extract posts; otherwise, use as is
        this.favorites = Array.isArray(response) ? response : (response.results || response.posts || []);
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des favoris:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.favorites];

    // Recherche textuelle
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        (post.category && post.category.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(post => {
        if (this.statusFilter === 'published') {
          return post.is_published;
        } else if (this.statusFilter === 'draft') {
          return !post.is_published;
        }
        return true;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'comments':
          return b.comments_count - a.comments_count;
        default:
          return 0;
      }
    });

    this.filteredFavorites = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.sortBy = 'date_desc';
    this.applyFilters();
  }

  removeFromFavorites(post: Post): void {
    if (!confirm(`Retirer "${post.title}" de vos favoris ?`)) {
      return;
    }

    this.postService.toggleFavorite(post.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== post.id);
        this.selectedPosts = this.selectedPosts.filter(id => id !== post.id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du favori:', error);
      }
    });
  }

  deletePost(post: Post): void {
    if (!confirm(`Supprimer définitivement l'article "${post.title}" ?`)) {
      return;
    }

    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== post.id);
        this.selectedPosts = this.selectedPosts.filter(id => id !== post.id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

  clearAllFavorites(): void {
    if (!confirm(`Retirer tous les ${this.favorites.length} articles de vos favoris ?`)) {
      return;
    }

    const favoriteIds = this.favorites.map(post => post.id);
    this.postService.removeMultipleFavorites(favoriteIds).subscribe({
      next: () => {
        this.favorites = [];
        this.filteredFavorites = [];
        this.selectedPosts = [];
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression des favoris:', error);
      }
    });
  }

  // Gestion de la sélection multiple
  toggleSelection(postId: number): void {
    const index = this.selectedPosts.indexOf(postId);
    if (index > -1) {
      this.selectedPosts.splice(index, 1);
    } else {
      this.selectedPosts.push(postId);
    }
  }

  isSelected(postId: number): boolean {
    return this.selectedPosts.includes(postId);
  }

  clearSelection(): void {
    this.selectedPosts = [];
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedPosts = [];
    } else {
      this.selectedPosts = this.filteredFavorites.map(post => post.id);
    }
  }

  isAllSelected(): boolean {
    return this.filteredFavorites.length > 0 && 
           this.selectedPosts.length === this.filteredFavorites.length &&
           this.filteredFavorites.every(post => this.selectedPosts.includes(post.id));
  }

  isSomeSelected(): boolean {
    return this.selectedPosts.length > 0 && !this.isAllSelected();
  }

  removeSelectedFromFavorites(): void {
    if (!confirm(`Retirer ${this.selectedPosts.length} article(s) de vos favoris ?`)) {
      return;
    }

    this.postService.removeMultipleFavorites(this.selectedPosts).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => !this.selectedPosts.includes(p.id));
        this.selectedPosts = [];
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression des favoris:', error);
      }
    });
  }

  deleteSelectedPosts(): void {
    if (!confirm(`Supprimer définitivement ${this.selectedPosts.length} article(s) sélectionné(s) ?`)) {
      return;
    }

    this.postService.deleteMultiplePosts(this.selectedPosts).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => !this.selectedPosts.includes(p.id));
        this.selectedPosts = [];
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression des articles:', error);
      }
    });
  }

  getContentPreview(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  }

  getPublishedCount(): number {
    return this.favorites.filter(post => post.is_published).length;
  }

  getDraftCount(): number {
    return this.favorites.filter(post => !post.is_published).length;
  }

  getTotalComments(): number {
    return this.favorites.reduce((total, post) => total + post.comments_count, 0);
  }

  getAverageComments(): string {
    if (this.favorites.length === 0) return '0';
    const average = this.getTotalComments() / this.favorites.length;
    return average.toFixed(1);
  }

  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}