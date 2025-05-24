import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentCreate, PaginatedResponse, CommentStats } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Obtenir tous les commentaires avec pagination et filtres
  getComments(page: number = 1, search?: string, ordering?: string): Observable<PaginatedResponse<Comment>> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    if (ordering) {
      params = params.set('ordering', ordering);
    }

    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/comments/`, { params });
  }

  // Obtenir un commentaire par ID
  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/comments/${id}/`);
  }

  // Créer un nouveau commentaire
  createComment(comment: CommentCreate): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments/`, comment);
  }

  // Mettre à jour un commentaire
  updateComment(id: number, comment: Partial<CommentCreate>): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/comments/${id}/`, comment);
  }

  // Supprimer un commentaire
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}/`);
  }

  // Obtenir les statistiques des commentaires
  getCommentStats(): Observable<CommentStats> {
    return this.http.get<CommentStats>(`${this.apiUrl}/comments/stats/`);
  }
}