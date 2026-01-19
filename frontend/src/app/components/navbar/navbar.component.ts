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
  `],
  template: `
    <header>
      <div class="header-container">
        <div class="logo">
          <img src="assets/iconos/logo-transparent-png.png" alt="Palacio Eventos Logo">
        </div>
        
        <div class="user-menu" *ngIf="currentUser; else loginBtn">
          <span>Hola, {{ currentUser.nombre }}</span>
          <span (click)="logout()" style="color: red; font-size: 0.8em; margin-left: 5px;">(Salir)</span>
        </div>
        <ng-template #loginBtn>
          <div class="user-menu" routerLink="/login">
            <span>Iniciar Sesión</span>
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