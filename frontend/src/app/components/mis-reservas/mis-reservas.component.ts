import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';

@Component({
    selector: 'app-mis-reservas',
    template: `
    <div class="main-container">
      <h1 style="text-align: center; color: #145214;">Mis Reservas</h1>
      <div *ngIf="reservas.length === 0" style="text-align: center; margin-top: 2rem;">
        <p>No tienes reservas aún.</p>
        <button routerLink="/" class="reserva-button">Explorar Salas</button>
      </div>
      
      <div style="max-width: 800px; margin: 2rem auto;">
        <div *ngFor="let reserva of reservas" style="border: 1px solid #ccc; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px; background: #fff;">
          <h3>{{ reserva.nombre_sala }}</h3>
          <p><strong>Fecha:</strong> {{ reserva.fecha_evento | date }}</p>
          <p><strong>Evento:</strong> {{ reserva.tipo_evento }}</p>
          <p><strong>Asistentes:</strong> {{ reserva.numero_asistentes }}</p>
          <p><strong>Estado:</strong> {{ reserva.estado }}</p>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class MisReservasComponent implements OnInit {
    reservas: any[] = [];
    constructor(private reservasService: ReservasService) { }
    ngOnInit() {
        this.reservasService.getMisReservas().subscribe(data => this.reservas = data);
    }
}
