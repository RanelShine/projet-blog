// src/app/components/post-list/post-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post, PaginatedResponse } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><i class="fas fa-newspaper me-2"></i>Articles du Blog</h1>
            <a routerLink="/posts/create" class="btn btn-primary">
              <i class="fas fa-plus me-1"></i>Nouvel Article
            </a>
          </div>

          <!-- Filtres et recherche -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Rechercher</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="searchTerm"
                    (input)="onSearch()"
                    placeholder="Titre ou contenu...">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Filtrer</label>
                  <select class="form-select" [(ngModel)]="favoriteFilter" (change)="onFilterChange()">
                    <option value="">Tous les articles</option>
                    <option value="true">Favoris seulement</option>
                    <option value="false">Non favoris</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Trier par</label>
                  <select class="form-select" [(ngModel)]="ordering" (change)="onSortChange()">
                    <option value="-created_at">Plus récents</option>
                    <option value="created_at">Plus anciens</option>
                    <option value="title">Titre A-Z</option>
                    <option value="-title">Titre Z-A</option>
                  </select>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button class="btn btn-outline-secondary w-100" (click)="resetFilters()">
                    <i class="fas fa-undo me-1"></i>Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>

          <!-- Liste des articles -->
          <div *ngIf="!loading && posts.length === 0" class="alert alert-info text-center">
            <i class="fas fa-info-circle me-2"></i>
            Aucun article trouvé.
          </div>

          <div class="row" *ngIf="!loading && posts.length > 0">
            <div class="col-lg-4 col-md-6 mb-4" *ngFor="let post of posts">
              <div class="card h-100 shadow-sm hover-card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <button 
                      class="btn btn-sm"
                      [class.btn-danger]="post.is_favorite"
                      [class.btn-outline-danger]="!post.is_favorite"
                      (click)="toggleFavorite(post)"
                      title="Basculer favori">
                      <i class="fas fa-heart"></i>
                    </button>
                  </div>
                  
                  <p class="card-text text-muted">
                    {{ post.content | slice:0:150 }}
                    <span *ngIf="post.content.length > 150">...</span>
                  </p>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      <i class="fas fa-calendar me-1"></i>
                      {{ post.created_at | date:'dd/MM/yyyy HH:mm' }}
                    </small>
                    <span class="badge bg-secondary">
                      <i class="fas fa-comments me-1"></i>
                      {{ post.comments_count }}
                    </span>
                  </div>
                </div>
                
                <div class="card-footer bg-transparent">
                  <div class="btn-group w-100" role="group">
                    <a [routerLink]="['/posts', post.id]" class="btn btn-outline-primary">
                      <i class="fas fa-eye me-1"></i>Voir
                    </a>
                    <a [routerLink]="['/posts', post.id, 'edit']" class="btn btn-outline-secondary">
                      <i class="fas fa-edit me-1"></i>Modifier
                    </a>
                    <button 
                      class="btn btn-outline-danger" 
                      (click)="deletePost(post)"
                      title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <nav *ngIf="totalPages > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="loadPage(currentPage - 1)" [disabled]="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              
              <li class="page-item" 
                  *ngFor="let page of getPageNumbers()" 
                  [class.active]="page === currentPage">
                <button class="page-link" (click)="loadPage(page)">{{ page }}</button>
              </li>
              
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="loadPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    }
    
    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.3;
    }
    
    .btn-group .btn {
      flex: 1;
    }
  `]
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  
  searchTerm = '';
  favoriteFilter = '';
  ordering = '-created_at';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    
    const isFavorite = this.favoriteFilter === 'true' ? true : 
                      this.favoriteFilter === 'false' ? false : undefined;

    this.postService.getPosts(
      this.currentPage,
      this.searchTerm || undefined,
      isFavorite,
      this.ordering
    ).subscribe({
      next: (response: PaginatedResponse<Post>) => {
        this.posts = response.results;
        this.totalCount = response.count;
        this.totalPages = Math.ceil(response.count / 10); // 10 articles par page
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadPosts();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadPosts();
  }

  onSortChange() {
    this.currentPage = 1;
    this.loadPosts();
  }

  resetFilters() {
    this.searchTerm = '';
    this.favoriteFilter = '';
    this.ordering = '-created_at';
    this.currentPage = 1;
    this.loadPosts();
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPosts();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleFavorite(post: Post) {
    this.postService.toggleFavorite(post.id).subscribe({
      next: (updatedPost) => {
        post.is_favorite = updatedPost.is_favorite;
      },
      error: (error) => {
        console.error('Erreur lors du changement de favori:', error);
      }
    });
  }

  deletePost(post: Post) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ?`)) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.loadPosts(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}