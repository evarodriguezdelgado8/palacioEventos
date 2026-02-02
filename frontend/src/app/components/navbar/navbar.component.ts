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

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe((x: any) => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
  }
}