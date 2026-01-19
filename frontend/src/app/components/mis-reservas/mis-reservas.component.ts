import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-mis-reservas',
  template: `
    <div *ngIf="toast.show" class="toast-notification" [ngClass]="{'toast-error': toast.isError}">
      <div class="toast-icon">{{ toast.isError ? '❌' : '✅' }}</div>
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
    </div>

    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>¿Cancelar Reserva?</h3>
        <p>Estás a punto de cancelar tu reserva en <strong>{{ reservaAEliminar?.nombre_sala }}</strong>.</p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
        
        <div class="modal-actions">
          <button class="btn-cancelar-modal" (click)="cerrarModal()">Mantener Reserva</button>
          <button class="btn-confirmar-modal" (click)="confirmarEliminacion()">Sí, Cancelar</button>
        </div>
      </div>
    </div>

    <div class="main-container">
      <h1 style="text-align: center; color: #145214;">Mis Reservas</h1>
      
      <div *ngIf="reservas.length === 0" style="text-align: center; margin-top: 2rem;">
        <p>No tienes reservas aún.</p>
        <button routerLink="/" class="btn-explorar">Explorar Salas</button>
      </div>
      
      <div style="max-width: 800px; margin: 2rem auto;">
        <div *ngFor="let reserva of reservas; let i = index" 
             class="reserva-card"
             [style.animation-delay]="i * 0.15 + 's'">
             
          <div class="card-content">
            <h3 style="color: #145214; margin-top: 0;">{{ reserva.nombre_sala }}</h3>
            <p><strong>Fecha:</strong> {{ reserva.fecha_evento | date:'dd/MM/yyyy' }}</p>
            <p><strong>Evento:</strong> {{ reserva.tipo_evento }}</p>
            <p><strong>Asistentes:</strong> {{ reserva.numero_asistentes }}</p>
            <p><strong>Estado:</strong> 
              <span [style.color]="reserva.estado === 'confirmada' ? 'green' : 'orange'" style="font-weight:bold">
                {{ reserva.estado | uppercase }}
              </span>
            </p>
          </div>

          <div class="card-actions">
            <button class="btn-action btn-edit" (click)="editarReserva(reserva.id)">
              ✏️ Editar
            </button>
            
            <button class="btn-action btn-delete" (click)="abrirModal(reserva)">
              🗑️ Eliminar
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ESTILOS DEL TOAST */
    .toast-notification {
      position: fixed;
      top: 120px; right: 20px;
      background-color: #145214; color: white;
      border: 2px solid white;
      padding: 15px 25px; border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 2000;
      display: flex; align-items: center; gap: 15px;
      animation: slideInToast 0.5s forwards;
    }
    .toast-error { background-color: #d32f2f; } /* Rojo para errores */
    @keyframes slideInToast {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* ESTILOS DEL MODAL */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); /* Fondo oscuro transparente */
      display: flex; justify-content: center; align-items: center;
      z-index: 1500;
      backdrop-filter: blur(3px); /* Efecto borroso chulo */
    }
    .modal-content {
      background: white; padding: 2rem; border-radius: 10px;
      width: 90%; max-width: 400px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: popIn 0.3s ease;
    }
    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .warning-text { color: #d32f2f; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .modal-actions { display: flex; justify-content: center; gap: 1rem; }
    .btn-cancelar-modal {
      padding: 10px 20px; background: #eee; border: none; border-radius: 5px; cursor: pointer;
    }
    .btn-confirmar-modal {
      padding: 10px 20px; background: #d32f2f; color: white; border: none; border-radius: 5px; cursor: pointer;
    }

    /* ESTILOS GENERALES (Iguales que antes) */
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reserva-card {
      border: 1px solid #ccc; padding: 0; margin-bottom: 1rem;
      border-radius: 8px; background: #fff; overflow: hidden;
      opacity: 0; animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .reserva-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-color: #145214; }
    .card-content { padding: 1.5rem; }
    .card-actions {
      background-color: #f9f9f9; padding: 10px 1.5rem; border-top: 1px solid #eee;
      display: flex; justify-content: flex-end; gap: 10px;
    }
    .btn-action {
      border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;
      font-size: 0.9rem; transition: background 0.2s; display: flex; align-items: center; gap: 5px;
    }
    .btn-edit { background-color: #e3f2fd; color: #0d47a1; }
    .btn-edit:hover { background-color: #bbdefb; }
    .btn-delete { background-color: #ffebee; color: #c62828; }
    .btn-delete:hover { background-color: #ffcdd2; }
    .btn-explorar { padding: 10px 20px; background-color: #145214; color: white; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; }
  `]
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  
  // Variables para el Modal y Toast
  showModal = false;
  reservaAEliminar: any = null;
  
  toast = { show: false, message: '', title: '', isError: false };

  constructor(
    private reservasService: ReservasService,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.obtenerReservas();
  }

  obtenerReservas() {
    this.reservasService.getMisReservas().subscribe({
      next: (data) => this.reservas = data,
      error: (err) => console.error('Error al cargar reservas:', err)
    });
  }

  editarReserva(id: number) {
    this.router.navigate(['/reservas'], { queryParams: { editId: id } });
  }

  // 1. Abrir Modal (No borra, solo pregunta)
  abrirModal(reserva: any) {
    this.reservaAEliminar = reserva;
    this.showModal = true;
  }

  // 2. Cerrar Modal (Si se arrepiente)
  cerrarModal() {
    this.showModal = false;
    this.reservaAEliminar = null;
  }

  // 3. Confirmar Eliminación (Llamada real)
  confirmarEliminacion() {
    if (!this.reservaAEliminar) return;

    // IMPORTANTE: Debug para ver qué ID estamos enviando
    console.log('Intentando eliminar reserva con ID:', this.reservaAEliminar.id);

    this.reservasService.eliminarReserva(this.reservaAEliminar.id).subscribe({
      next: () => {
        // ÉXITO
        this.reservas = this.reservas.filter(r => r.id !== this.reservaAEliminar.id);
        this.cerrarModal();
        this.mostrarToast('Reserva Cancelada', 'La reserva ha sido eliminada correctamente.', false);
      },
      error: (err) => {
        // ERROR
        console.error('Error detallado del backend:', err);
        this.cerrarModal();
        this.mostrarToast('Error', 'No se pudo eliminar la reserva. Revisa la consola.', true);
      }
    });
  }

  mostrarToast(title: string, message: string, isError: boolean) {
    this.toast = { show: true, title, message, isError };
    setTimeout(() => {
      this.toast.show = false;
    }, 4000);
  }
}