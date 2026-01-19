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
         <img *ngFor="let img of getSalaImages()" [src]="img" [alt]="sala.nombre">
      </div>

      <div class="sala-info">
        <div class="info-item">
            <h3 class="info-header">Descripción</h3>
            <div class="info-content">
                <p>{{ sala.descripcion }}</p>
                <p><strong>Capacidad:</strong> {{ sala.capacidad }} personas</p>
                <div class="plano-container" style="margin-top: 20px;">
                    <h4>Plano de la Sala</h4>
                    <img [src]="getPlanoImage()" alt="Plano de {{ sala.nombre }}" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 5px;">
                </div>
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
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.reservasService.getSalaById(+id).subscribe(data => {
                    this.sala = data;
                });
            }
        });
    }

    irAReservar() {
        this.router.navigate(['/reservar', this.sala.id]);
    }

    getPlanoImage(): string {
        if (!this.sala) return '';
        const normalized = this.normalizeSalaName(this.sala.nombre);
        // Special casing based on known files
        return `assets/${normalized}/plano${normalized.charAt(0).toUpperCase() + normalized.slice(1)}.png`;
    }

    getSalaImages(): string[] {
        if (!this.sala) return [];
        const normalized = this.normalizeSalaName(this.sala.nombre);

        // Manual mapping based on known assets
        if (normalized === 'salaEscenica') {
            return [
                'assets/salaEscenica/salaEscenica1.jpg',
                'assets/salaEscenica/salaEscenica2.jpg',
                'assets/salaEscenica/salaEscenica3.jpg'
            ];
        } else if (normalized === 'salaJardin') {
            return [
                'assets/salaJardin/salaJardin1.jpg',
                'assets/salaJardin/salaJardin2.jpg',
                'assets/salaJardin/salaJardin3.jpg',
                // 'assets/salaJardin/salaJardin4.jpg' // Optional
            ];
        } else if (normalized === 'salaModernista') {
            return [
                'assets/salaModernista/salaModernista1.webp',
                'assets/salaModernista/salaModernista2.png',
                'assets/salaModernista/salaModernista3.webp',
                // 'assets/salaModernista/salaModernista4.png'
            ];
        } else if (normalized === 'salaReal') {
            return [
                'assets/salaReal/salaReal1.webp',
                'assets/salaReal/salaReal2.webp',
                'assets/salaReal/salaReal3.webp'
            ];
        }

        // Fallback
        return ['assets/' + this.sala.imagen_url];
    }

    private normalizeSalaName(nombre: string): string {
        if (!nombre) return '';
        const lower = nombre.toLowerCase();
        if (lower.includes('escénica') || lower.includes('escenica')) return 'salaEscenica';
        if (lower.includes('jardín') || lower.includes('jardin')) return 'salaJardin';
        if (lower.includes('modernista')) return 'salaModernista';
        if (lower.includes('real')) return 'salaReal';
        return 'salaEscenica'; // default or handle error
    }
}
