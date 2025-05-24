import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div *ngIf="!loading && post">
        <!-- En-tête de l'article -->
        <div class="row mb-4">
          <div class="col-12">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a routerLink="/posts">Articles</a></li>
                <li class="breadcrumb-item active">{{ post.title }}</li>
              </ol>
            </nav>
          </div>
        </div>

        <!-- Article principal -->
        <div class="row">
          <div class="col-lg-8">
            <article class="card shadow-sm">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 class="card-title mb-2">{{ post.title }}</h1>
                    <div class="text-muted">
                      <small>
                        <i class="fas fa-calendar me-2"></i>
                        Publié le {{ post.created_at | date:'dd/MM/yyyy à HH:mm' }}
                      </small>
                      <small *ngIf="post.updated_at !== post.created_at" class="ms-3">
                        <i class="fas fa-edit me-2"></i>
                        Modifié le {{ post.updated_at | date:'dd/MM/yyyy à HH:mm' }}
                      </small>
                    </div>
                  </div>
                  <button 
                    class="btn btn-sm"
                    [class.btn-danger]="post.is_favorite"
                    [class.btn-outline-danger]="!post.is_favorite"
                    (click)="toggleFavorite()"
                    title="Basculer favori">
                    <i class="fas fa-heart me-1"></i>
                    {{ post.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="article-content">
                  <p class="lead" [innerHTML]="post.content | slice:0:200"></p>
                  <div [innerHTML]="post.content | slice:200" *ngIf="post.content.length > 200"></div>
                </div>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="stats">
                    <span class="badge bg-secondary me-2">
                      <i class="fas fa-comments me-1"></i>
                      {{ post.comments_count }} commentaire(s)
                    </span>
                    <span class="badge bg-info" *ngIf="post.is_favorite">
                      <i class="fas fa-heart me-1"></i>
                      Favori
                    </span>
                  </div>
                  <div class="actions">
                    <a [routerLink]="['/posts', post.id, 'edit']" class="btn btn-outline-primary me-2">
                      <i class="fas fa-edit me-1"></i>Modifier
                    </a>
                    <button class="btn btn-outline-danger" (click)="deletePost()">
                      <i class="fas fa-trash me-1"></i>Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Section des commentaires -->
            <div class="card shadow-sm mt-4">
              <div class="card-header">
                <h3 class="card-title mb-0">
                  <i class="fas fa-comments me-2"></i>
                  Commentaires ({{ comments.length }})
                </h3>
              </div>
              <div class="card-body">
                <!-- Formulaire d'ajout de commentaire -->
                <form (ngSubmit)="addComment()" class="mb-4">
                  <div class="mb-3">
                    <label for="commentAuthor" class="form-label">Nom</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="commentAuthor"
                      [(ngModel)]="newComment.author" 
                      name="author"
                      required
                      placeholder="Votre nom">
                  </div>
                  <div class="mb-3">
                    <label for="commentContent" class="form-label">Commentaire</label>
                    <textarea 
                      class="form-control" 
                      id="commentContent"
                      [(ngModel)]="newComment.content" 
                      name="content"
                      rows="4"
                      required
                      placeholder="Votre commentaire..."></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" [disabled]="submittingComment">
                    <span *ngIf="submittingComment" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="fas fa-paper-plane me-1" *ngIf="!submittingComment"></i>
                    {{ submittingComment ? 'Envoi...' : 'Publier le commentaire' }}
                  </button>
                </form>

                <!-- Liste des commentaires -->
                <div *ngIf="comments.length === 0" class="text-center text-muted py-4">
                  <i class="fas fa-comment-slash fa-2x mb-2"></i>
                  <p>Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                </div>

                <div *ngFor="let comment of comments; trackBy: trackByCommentId" class="comment mb-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">
                          <i class="fas fa-user me-2"></i>
                          {{ comment.author }}
                        </h6>
                        <small class="text-muted">
                          <i class="fas fa-clock me-1"></i>
                          {{ comment.created_at | date:'dd/MM/yyyy à HH:mm' }}
                        </small>
                      </div>
                      <div class="comment-content" [innerHTML]="comment.content"></div>
                      <div class="comment-actions mt-2" *ngIf="canModerateComments">
                        <button 
                          class="btn btn-sm btn-outline-danger"
                          (click)="deleteComment(comment.id)"
                          title="Supprimer le commentaire">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-info-circle me-2"></i>
                  Informations
                </h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <strong>Date de publication :</strong><br>
                    <small class="text-muted">{{ post.created_at | date:'dd/MM/yyyy à HH:mm' }}</small>
                  </li>
                  <li class="mb-2" *ngIf="post.updated_at !== post.created_at">
                    <strong>Dernière modification :</strong><br>
                    <small class="text-muted">{{ post.updated_at | date:'dd/MM/yyyy à HH:mm' }}</small>
                  </li>
                  <li class="mb-2">
                    <strong>Nombre de commentaires :</strong><br>
                    <small class="text-muted">{{ comments.length }}</small>
                  </li>
                  <li class="mb-2">
                    <strong>Statut :</strong><br>
                    <span class="badge" [class.bg-success]="post.is_published" [class.bg-warning]="!post.is_published">
                      {{ post.is_published ? 'Publié' : 'Brouillon' }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Articles similaires -->
            <div class="card shadow-sm mt-3" *ngIf="relatedPosts.length > 0">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-newspaper me-2"></i>
                  Articles similaires
                </h5>
              </div>
              <div class="card-body">
                <div *ngFor="let relatedPost of relatedPosts" class="mb-2">
                  <a [routerLink]="['/posts', relatedPost.id]" class="text-decoration-none">
                    <small class="d-block">{{ relatedPost.title }}</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div *ngIf="!loading && !post" class="text-center py-5">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Article non trouvé ou une erreur s'est produite.
          <div class="mt-2">
            <a routerLink="/posts" class="btn btn-primary">
              <i class="fas fa-arrow-left me-1"></i>
              Retour aux articles
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  relatedPosts: Post[] = [];
  loading = true;
  submittingComment = false;
  canModerateComments = false; // À adapter selon vos permissions
  
  newComment = {
    author: '',
    content: '',
    post_id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      if (postId) {
        this.loadPost(postId);
        this.loadComments(postId);
        this.loadRelatedPosts(postId);
      }
    });
  }

  loadPost(id: number): void {
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.newComment.post_id = post.id;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article:', error);
        this.loading = false;
      }
    });
  }

  loadComments(postId: number): void {
    this.postService.getComments(postId).subscribe(
      (response: any) => {
        // If your API returns { results: Comment[], ... }, adjust accordingly
        this.comments = response.results ?? response.comments ?? response;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    );
  }

  loadRelatedPosts(postId: number): void {
    this.postService.getRelatedPosts(postId).subscribe(
      (response: any) => {
        // If your API returns { results: Post[], ... }, adjust accordingly
        this.relatedPosts = response.results ?? response.posts ?? response;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des articles similaires:', error);
      }
    );
  }

  toggleFavorite(): void {
    if (!this.post) return;

    this.postService.toggleFavorite(this.post.id).subscribe({
      next: (updatedPost) => {
        this.post = updatedPost;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des favoris:', error);
      }
    });
  }

  addComment(): void {
    if (!this.newComment.author.trim() || !this.newComment.content.trim()) {
      return;
    }

    this.submittingComment = true;

    this.postService.addComment(this.newComment).subscribe({
      next: (comment: any) => {
        this.comments.unshift(comment);
        this.newComment = {
          author: '',
          content: '',
          post_id: this.post!.id
        };
        this.submittingComment = false;
        
        // Mettre à jour le compteur de commentaires du post
        if (this.post) {
          this.post.comments_count = this.comments.length;
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        this.submittingComment = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    this.postService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
        
        // Mettre à jour le compteur de commentaires du post
        if (this.post) {
          this.post.comments_count = this.comments.length;
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression du commentaire:', error);
      }
    });
  }

  deletePost(): void {
    if (!this.post) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de l\'article:', error);
      }
    });
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }
}