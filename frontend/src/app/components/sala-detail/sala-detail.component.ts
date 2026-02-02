import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sala-detail',
    templateUrl: './sala-detail.component.html',
    styleUrls: ['./sala-detail.component.scss']
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
