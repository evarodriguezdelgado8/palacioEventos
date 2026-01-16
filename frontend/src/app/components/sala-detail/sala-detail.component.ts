import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sala-detail',
    template: `
    <div class="main-container" *ngIf="sala">
      <div class="sala-header">
        <h1>{{ sala.nombre }}</h1>
      </div>

      <div class="sala-images">
         <img [src]="'assets/' + sala.imagen_url" [alt]="sala.nombre">
         <img src="assets/detalle1.jpg" onerror="this.src='https://placehold.co/400x300'" alt="Detalle">
         <img src="assets/detalle2.jpg" onerror="this.src='https://placehold.co/400x300'" alt="Detalle">
      </div>

      <div class="sala-info">
        <div class="info-item">
            <h3 class="info-header">Descripción</h3>
            <div class="info-content">
                <p>{{ sala.descripcion }}</p>
                <p><strong>Capacidad:</strong> {{ sala.capacidad }} personas</p>
            </div>
        </div>
      </div>

      <div class="reserva-centro">
        <button *ngIf="isLoggedIn; else loginToBook" class="reserva-button" (click)="irAReservar()">Reservar Ahora</button>
        <ng-template #loginToBook>
            <p>Inicia sesión para reservar</p>
            <button class="reserva-button" routerLink="/login">Ir a Login</button>
        </ng-template>
      </div>
    </div>
  `,
    styles: []
})
export class SalaDetailComponent implements OnInit {
    sala: any;
    isLoggedIn = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private reservasService: ReservasService,
        private authService: AuthService
    ) {
        this.isLoggedIn = this.authService.isAuthenticated();
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.reservasService.getSalaById(+id).subscribe(data => {
                this.sala = data;
            });
        }
    }

    irAReservar() {
        this.router.navigate(['/reservar', this.sala.id]);
    }
}
