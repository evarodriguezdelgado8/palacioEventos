import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="main-container">
      <section class="principal">
        <h1>Palacio de Eventos</h1>
        <h2>Experiencias Inolvidables</h2>
        <div class="principal-imagen">
             <!-- Assuming assets exist, otherwise placeholder -->
             <img src="assets/vistaAerea.png" alt="Palacio Principal">
        </div>
      </section>

      <section class="descripcion">
        <p>Bienvenidos al Palacio de Eventos</p>
        <p>Descubre un lugar donde la elegancia se encuentra con la funcionalidad. Nuestras salas están diseñadas para hacer de tu evento un momento único.</p>
      </section>

      <section class="salas-grid">
        <div class="sala-tarjeta" *ngFor="let sala of salas" [routerLink]="['/salas', sala.id]">
          <img [src]="'assets/' + sala.imagen_url" [alt]="sala.nombre" onerror="this.src='https://placehold.co/600x400'">
          <h3>{{ sala.nombre }}</h3>
        </div>
      </section>
      
      <!-- Eventos Galeria (Static for now as per prototype) -->

    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  salas: any[] = [];

  constructor(private reservasService: ReservasService) { }

  ngOnInit() {
    this.reservasService.getAllSalas().subscribe(data => {
      this.salas = data;
    });
  }
}
