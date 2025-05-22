import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:8000/api'; // Ton backend Django

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get(`${this.baseUrl}/posts/`);
  }

  getPost(id: number) {
    return this.http.get(`${this.baseUrl}/posts/${id}/`);
  }

  addPost(data: any) {
    return this.http.post(`${this.baseUrl}/posts/`, data);
  }

  updatePost(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/posts/${id}/`, data);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.baseUrl}/posts/${id}/`);
  }

  getComments() {
    return this.http.get(`${this.baseUrl}/comments/`);
  }

  addComment(data: any) {
    return this.http.post(`${this.baseUrl}/comments/`, data);
  }

  searchPosts(quergv 