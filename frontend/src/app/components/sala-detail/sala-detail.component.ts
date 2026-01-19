import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sala-detail',
    template: `
    <div class="main-container" *ngIf="sala">
      <!-- Header / Title -->
      <div class="sala-header">
        <h1>{{ sala.nombre }}</h1>
      </div>

      <!-- Image Carousel / Grid -->
      <div class="sala-images">
         <img *ngFor="let img of getSalaImages()" [src]="img" [alt]="sala.nombre">
      </div>

      <!-- Info Section with Enhanced Visuals -->
      <div class="sala-info-container">
        <div class="sala-description-card">
            <h3 class="info-header">Sobre este espacio</h3>
            
            <div class="info-content-expanded">
                <p class="intro-text">{{ getExpandedDescription() }}</p>
                <p class="original-desc">{{ sala.descripcion }}</p>
                
                <div class="capacity-badge">
                    <strong>Capacidad:</strong> {{ sala.capacidad }} personas
                </div>

                <div class="plano-section">
                    <h4>Distribución y Plano</h4>
                    <div class="plano-wrapper">
                        <img [src]="getPlanoImage()" alt="Plano de {{ sala.nombre }}">
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Reservation Button Area -->
      <div class="reserva-centro">
        <button *ngIf="isLoggedIn; else loginToBook" class="reserva-button" (click)="irAReservar()">Reservar Ahora</button>
        <ng-template #loginToBook>
            <p class="login-prompt">Inicia sesión para realizar una reserva en este exclusivo espacio.</p>
            <button class="reserva-button secondary" routerLink="/login">Ir a Login</button>
        </ng-template>
      </div>
    </div>
  `,
    styles: [`
    .main-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: var(--font-body);
    }
    .sala-header h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--color-dark);
        font-family: var(--font-heading);
        font-size: 2.5rem;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .sala-images {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 1rem;
        margin-bottom: 3rem;
        justify-content: center;
    }
    .sala-images img {
        height: 300px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .sala-images img:hover {
        transform: scale(1.02);
    }
    .sala-info-container {
        background: #fdfdfd;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 3rem;
        box-shadow: 0 2px 15px rgba(0,0,0,0.05);
        margin-bottom: 3rem;
    }
    .info-header {
        color: var(--color-gold); /* Gold */
        font-family: var(--font-heading);
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
    }
    .intro-text {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #555;
        margin-bottom: 1.5rem;
    }
    .original-desc {
        font-size: 1rem;
        color: #666;
        margin-bottom: 2rem;
        font-style: italic;
    }
    .capacity-badge {
        display: inline-block;
        background: var(--color-dark);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        font-size: 0.9rem;
        margin-bottom: 2rem;
    }
    .plano-section h4 {
        color: var(--color-dark);
        font-family: var(--font-heading);
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }
    .plano-wrapper {
        text-align: center;
        background: #fff;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .plano-wrapper img {
        max-width: 100%;
        height: auto;
    }
    .reserva-centro {
        text-align: center;
        margin-top: 2rem;
    }
    .reserva-button {
        background-color: var(--color-gold);
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.3s;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .reserva-button:hover {
        background-color: var(--color-gold-hover);
    }
    .reserva-button.secondary {
        background-color: #555;
    }
    .reserva-button.secondary:hover {
        background-color: #333;
    }
    .login-prompt {
        color: #666;
        margin-bottom: 1rem;
    }
  `]
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
        return `assets/${normalized}/plano${normalized.charAt(0).toUpperCase() + normalized.slice(1)}.png`;
    }

    getExpandedDescription(): string {
        if (!this.sala) return '';
        const normalized = this.normalizeSalaName(this.sala.nombre);

        switch (normalized) {
            case 'salaEscenica':
                return "Sumérgete en un ambiente dramático y sofisticado. La Sala Escénica está diseñada para aquellos eventos que buscan impactar. Con una acústica impecable y una iluminación teatral adaptable, este espacio es ideal para presentaciones de productos, conferencias magistrales o recepciones que requieran un toque de espectacularidad artística.";
            case 'salaJardin':
                return "Un oasis de tranquilidad en el corazón de la ciudad. La Sala Jardín ofrece una conexión directa con la naturaleza, permitiendo que la luz natural inunde el espacio. Rodeada de vegetación cuidadosamente seleccionada, es el escenario perfecto para bodas románticas, cócteles al atardecer o eventos diurnos que busquen frescura y elegancia orgánica.";
            case 'salaModernista':
                return "Donde la vanguardia se encuentra con la tradición. La Sala Modernista destaca por sus líneas audaces y su arquitectura contemporánea con guiños clásicos. Sus amplios ventanales y su diseño diáfano la convierten en un lienzo versátil para exposiciones de arte, cenas de gala modernas y eventos corporativos que deseen proyectar innovación y estilo.";
            case 'salaReal':
                return "La joya de la corona del Palacio. La Sala Real evoca la grandeza de los salones de baile históricos, con techos altos, lámparas de araña impresionantes y detalles dorados que exudan lujo y exclusividad. Es el lugar definitivo para grandes banquetes, bodas de cuento de hadas y celebraciones institucionales de alto nivel.";
            default:
                return "Un espacio exclusivo diseñado para brindar la mejor experiencia a tus invitados, combinando elegancia, confort y funcionalidad en cada detalle.";
        }
    }

    getSalaImages(): string[] {
        if (!this.sala) return [];
        const normalized = this.normalizeSalaName(this.sala.nombre);

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
            ];
        } else if (normalized === 'salaModernista') {
            return [
                'assets/salaModernista/salaModernista1.webp',
                'assets/salaModernista/salaModernista2.png',
                'assets/salaModernista/salaModernista3.webp',
            ];
        } else if (normalized === 'salaReal') {
            return [
                'assets/salaReal/salaReal1.webp',
                'assets/salaReal/salaReal2.webp',
                'assets/salaReal/salaReal3.webp'
            ];
        }
        return ['assets/' + this.sala.imagen_url];
    }

    private normalizeSalaName(nombre: string): string {
        if (!nombre) return '';
        const lower = nombre.toLowerCase();
        if (lower.includes('escénica') || lower.includes('escenica')) return 'salaEscenica';
        if (lower.includes('jardín') || lower.includes('jardin')) return 'salaJardin';
        if (lower.includes('modernista')) return 'salaModernista';
        if (lower.includes('real')) return 'salaReal';
        return 'salaEscenica';
    }
}
