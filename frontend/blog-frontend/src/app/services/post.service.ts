// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post, PostCreate, PaginatedResponse, PostStats } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  deleteMultiplePosts(ids: number[]): Observable<any> {
    return this.http.post<any>(`/api/posts/delete-multiple/`, { ids });
  }
  subscribeToPostUpdates(postId: number): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${postId}/`);
  }
  removeMultipleFavorites(ids: number[]): Observable<any> {
    return this.http.post<any>(`/api/posts/favorites/remove/`, { ids });
  }
  
    deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`/api/comments/${commentId}`);
  }
  addComment(newComment: { author: string; content: string; post_id: number; }): Observable<Comment> {
    return this.http.post<Comment>(`/api/comments/`, newComment);
  }
  getRelatedPosts(postId: number): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`/api/posts/${postId}/related/`);
  }
  getComments(postId: number): Observable<PaginatedResponse<Comment>> {
    return this.http.get<PaginatedResponse<Comment>>(`/api/posts/${postId}/comments/`);
  }
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Obtenir tous les posts avec pagination et filtres
  getPosts(page: number = 1, search?: string, isFavorite?: boolean, ordering?: string): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    if (isFavorite !== undefined) {
      params = params.set('is_favorite', isFavorite.toString());
    }
    if (ordering) {
      params = params.set('ordering', ordering);
    }

    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/`, { params });
  }

  // Obtenir un post par ID
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}/`);
  }

  // Créer un nouveau post
  createPost(post: PostCreate): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts/`, post);
  }

  // Mettre à jour un post
  updatePost(id: number, post: Partial<PostCreate>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/posts/${id}/`, post);
  }

  // Supprimer un post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}/`);
  }

  // Basculer le statut favori d'un post
  toggleFavorite(id: number): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts/${id}/toggle-favorite/`, {});
  }

  // Obtenir les posts favoris
  getFavoritePosts(): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/favorites/`);
  }

  // Obtenir les statistiques des posts
  getPostStats(): Observable<PostStats> {
    return this.http.get<PostStats>(`${this.apiUrl}/posts/stats/`);
  }

  // Obtenir les commentaires d'un post
  getPostComments(postId: number, page: number = 1): Observable<PaginatedResponse<Comment>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/posts/${postId}/comments/`, { params });
  }

  // Ajouter un commentaire à un post
  addCommentToPost(postId: number, comment: { author: string; content: string }): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments/add/`, comment);
  }
}