import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h2 class="card-title mb-0">
                  <i class="fas fa-edit me-2"></i>
                  {{ isEditMode ? "Modifier l'article" : "Créer un nouvel article" }}
                </h2>
                <a routerLink="/posts" class="btn btn-primary">
                  <i class="fas fa-arrow-left me-1"></i>
                  Retour
                </a>
              </div>
            </div>
            <div class="card-body">
              <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Titre *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="title"
                    formControlName="title"
                    [class.is-invalid]="postForm.get('title')?.invalid && postForm.get('title')?.touched">
                  <div class="invalid-feedback" *ngIf="postForm.get('title')?.invalid && postForm.get('title')?.touched">
                    Le titre est requis (minimum 3 caractères).
                  </div>
                </div>

                <div class="mb-3">
                  <label for="content" class="form-label">Contenu *</label>
                  <textarea 
                    class="form-control" 
                    id="content"
                    rows="10"
                    formControlName="content"
                    [class.is-invalid]="postForm.get('content')?.invalid && postForm.get('content')?.touched"></textarea>
                  <div class="invalid-feedback" *ngIf="postForm.get('content')?.invalid && postForm.get('content')?.touched">
                    Le contenu est requis (minimum 10 caractères).
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="isPublished"
                      formControlName="is_published">
                    <label class="form-check-label" for="isPublished">
                      Publier immédiatement
                    </label>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="isFavorite"
                      formControlName="is_favorite">
                    <label class="form-check-label" for="isFavorite">
                      Ajouter aux favoris
                    </label>
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    (click)="goBack()">
                    <i class="fas fa-times me-1"></i>
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="postForm.invalid || submitting">
                    <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="fas fa-save me-1" *ngIf="!submitting"></i>
                    {{ submitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  submitting = false;
  postId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      is_published: [false],
      is_favorite: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.postId = +params['id'];
        this.loadPost(this.postId);
      }
    });
  }

  loadPost(id: number): void {
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          is_published: post.is_published,
          is_favorite: post.is_favorite
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article:', error);
        this.router.navigate(['/posts']);
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formData = this.postForm.value;

    if (this.isEditMode && this.postId) {
      this.postService.updatePost(this.postId, formData).subscribe({
        next: (post) => {
          this.router.navigate(['/posts', post.id]);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.submitting = false;
        }
      });
    } else {
      this.postService.createPost(formData).subscribe({
        next: (post) => {
          this.router.navigate(['/posts', post.id]);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode && this.postId) {
      this.router.navigate(['/posts', this.postId]);
    } else {
      this.router.navigate(['/posts']);
    }
  }
}