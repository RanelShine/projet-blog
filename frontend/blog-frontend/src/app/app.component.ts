import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-blog me-2"></i>RBlog
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/posts" routerLinkActive="active">
                <i class="fas fa-home me-1"></i>Articles
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/posts/create" routerLinkActive="active">
                <i class="fas fa-plus me-1"></i>Créer
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/favorites" routerLinkActive="active">
                <i class="fas fa-heart me-1"></i>Favoris
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/comments" routerLinkActive="active">
                <i class="fas fa-comments me-1"></i>Commentaires
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/stats" routerLinkActive="active">
                <i class="fas fa-chart-bar me-1"></i>Statistiques
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container-fluid py-4">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="mb-0 text-muted">
          <i class="fas fa-code me-1"></i>
          © Ranelle - {{ currentYear }}
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
    }
    
    .nav-link {
      transition: all 0.3s ease;
    }
    
    .nav-link:hover {
      transform: translateY(-1px);
    }
    
    main {
      min-height: calc(100vh - 200px);
    }
    
    footer {
      margin-top: auto;
    }
  `]
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  currentYear = new Date().getFullYear();
}