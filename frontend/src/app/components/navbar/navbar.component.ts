import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  // SOLO AÑADIMOS EL CSS DE LA LÍNEA AQUÍ
  styles: [`
    /* Preparamos el enlace para que la línea se posicione respecto a él */
    nav a {
      position: relative;
      text-decoration: none; /* Aseguramos que no haya subrayado por defecto */
    }

    /* Dibujamos la línea (invisible inicialmente) */
    nav a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;        /* Grosor de la línea */
      bottom: 0;          /* Pegada abajo del texto */
      left: 50%;          /* Empieza desde el centro */
      background-color: #d4af37; /* Color Dorado */
      transition: all 0.3s ease-in-out; /* Animación suave */
    }

    /* Hacemos que la línea crezca al pasar el ratón (Hover) o si está activo */
    nav a:hover::after,
    nav a.active::after {
      width: 100%;
      left: 0;
    }

    /* Logo SVG Animation */
    .logo-svg-anim {
      /* Removed global white fill to let image show through */
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      margin-right: 1rem;
      /* Match original image size roughly to prevent shifts */
      width: 70px;
      height: 70px;
    }
    .logo-svg-anim:hover {
      transform: scale(1.15) rotate(5deg);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }

    /* User SVG Animation */
    .user-svg-anim {
      /* User Menu has white background, so icon must be Dark Green */
      fill: #145214; 
      transition: all 0.3s ease;
    }
    /* When hovering the link container, turn icon Gold */
    .user-menu:hover .user-svg-anim {
      fill: #FFD700;
      transform: scale(1.2);
    }
    
    .logo-text {
        color: #fff;
        font-weight: bold;
        font-size: 1.4rem; /* Restoring original size */
        margin-left: 10px;
    }
  `],
  template: `
    <header>
      <div class="header-container">
        <div class="logo">
          <!-- SVG Logo: Palacio Animado (Image Inside House) -->
          <svg class="logo-svg-anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Logo Palacio">
            <!-- 1. The Image (Maximized inside the house area) -->
            <!-- Adjusted position and size to fill the house frame better -->
            <image href="assets/iconos/logo-transparent-png.png" x="15" y="25" width="70" height="60" preserveAspectRatio="xMidYMid meet" />
            
            <!-- 2. The House Outline (Overlay - No inner details) -->
            <path fill="none" stroke="#FFFFFF" stroke-width="3" d="M10,80 L10,30 L50,5 L90,30 L90,80 Z" />
          </svg>
          <span class="logo-text">Palacio de Eventos</span>
        </div>
        
        <div class="user-menu" *ngIf="currentUser; else loginBtn">
          <span>Hola, {{ currentUser.nombre }}</span>
          <span (click)="logout()" style="color: red; font-size: 0.8em; margin-left: 5px;">(Salir)</span>
        </div>
        <ng-template #loginBtn>
          <div class="user-menu" routerLink="/login">
            <!-- SVG Icon: User Animado -->
            <svg class="user-svg-anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-label="Usuario">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </ng-template>
      </div>
    </header>

    <nav>
      <div class="nav-container">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
        <a routerLink="/informacion-general" routerLinkActive="active">Información</a>
        <a routerLink="/galeria" routerLinkActive="active">Galería</a>
        <a routerLink="/salas/1">Sala Real</a>
        <a routerLink="/salas/2">Sala Modernista</a>
        <a routerLink="/salas/3">Sala Escénica</a>
        <a routerLink="/salas/4">Sala Jardín</a>
        <a routerLink="/mis-reservas" *ngIf="currentUser">Mis Reservas</a>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentUser: any;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe((x: any) => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
  }
}