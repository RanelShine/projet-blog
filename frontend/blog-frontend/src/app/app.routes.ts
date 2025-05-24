import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { 
    path: 'posts', 
    loadComponent: () => import('./components/post-list/post-list.component').then(m => m.PostListComponent) 
  },
  { 
    path: 'posts/create', 
    loadComponent: () => import('./components/post-form/post-form.component').then(m => m.PostFormComponent) 
  },
  { 
    path: 'posts/:id', 
    loadComponent: () => import('./components/post-detail/post-detail.component').then(m => m.PostDetailComponent) 
  },
  { 
    path: 'posts/:id/edit', 
    loadComponent: () => import('./components/post-form/post-form.component').then(m => m.PostFormComponent) 
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent) 
  },
  { 
    path: 'comments', 
    loadComponent: () => import('./components/comment-list/comment-list.component').then(m => m.CommentListComponent) 
  },
  { 
    path: 'stats', 
    loadComponent: () => import('./components/stats/stats.component').then(m => m.StatsComponent) 
  },
  { path: '**', redirectTo: '/posts' }
];