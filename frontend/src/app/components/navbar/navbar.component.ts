import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  // SOLO AÑADIMOS EL CSS DE LA LÍNEA AQUÍ
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentUser: any;
  isMenuOpen = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe((x: any) => this.currentUser = x);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }
}