import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { Router } from '@angular/router';

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
        <p>Vas a cancelar tu evento en:</p>
        <h4 style="color: #145214; font-size: 1.3rem; margin: 10px 0;">{{ reservaAEliminar?.nombre_sala }}</h4>
        <p class="warning-text">⚠️ Esta acción no se puede deshacer.</p>
        
        <div class="modal-actions">
          <button class="btn-cancelar-modal" (click)="cerrarModal()">Mantener</button>
          <button class="btn-confirmar-modal" (click)="confirmarEliminacion()">Sí, Cancelar</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="header-actions">
        <h1>Mis Reservas</h1>
        <button class="btn-new" routerLink="/">
          ➕ Nueva Reserva
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div> Cargando tus reservas...
      </div>

      <div *ngIf="!loading && reservas.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No tienes reservas activas</h3>
        <p>¡Reserva tu sala ideal hoy mismo!</p>
        <button class="btn-new" routerLink="/">Explorar Salas</button>
      </div>

      <div class="reservas-grid" *ngIf="!loading && reservas.length > 0">
        
        <div *ngFor="let reserva of reservas; let i = index" 
             class="reserva-card"
             [style.animation-delay]="i * 0.1 + 's'">
          
          <div class="card-header">
            <span class="sala-name">{{ reserva.nombre_sala || 'Sala del Palacio' }}</span>
            <span class="fecha-badge">
              {{ reserva.fecha_evento | date:'dd MMM yyyy' }}
            </span>
          </div>
          
          <div class="card-body">
            
            <div class="info-grid-clean">
              
              <div class="info-clean-item">
                <span class="label-clean">
                  <span class="icon">🎈</span> Tipo de Evento
                </span>
                <span class="value-clean">{{ reserva.tipo_evento }}</span>
              </div>

              <div class="vertical-divider"></div>

              <div class="info-clean-item right-align">
                <span class="label-clean">
                  <span class="icon">👥</span> Asistentes
                </span>
                <span class="value-clean">{{ reserva.numero_asistentes }} personas</span>
              </div>

            </div>
            <div class="status-row">
               <span class="label-simple">Estado:</span>
               <span class="status-badge" [ngClass]="reserva.estado">
                 {{ reserva.estado | uppercase }}
               </span>
            </div>

            <div class="services-section">
              <span class="label-simple">Detalles y Servicios:</span>
              <div class="services-box" [ngClass]="{'has-services': reserva.servicios_adicionales && reserva.servicios_adicionales !== 'No solicitados'}">
                <p>{{ reserva.servicios_adicionales || 'Sin servicios extra solicitados.' }}</p>
              </div>
            </div>

          </div>

          <div class="card-actions">
            <button class="btn-action edit" (click)="editarReserva(reserva)">
              ✏️ Modificar
            </button>
            <button class="btn-action delete" (click)="abrirModal(reserva)">
              🗑️ Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ================= TOAST & MODAL ================= */
    .toast-notification {
      position: fixed; top: 100px; right: 20px;
      background-color: #145214; color: white;
      border: 2px solid white; padding: 15px 25px; border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 2000;
      display: flex; align-items: center; gap: 15px; animation: slideInToast 0.5s forwards;
    }
    .toast-error { background-color: #d32f2f; }
    @keyframes slideInToast { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center; z-index: 1500;
    }
    .modal-content {
      background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .warning-text { color: #d32f2f; background: #ffebee; padding: 8px; border-radius: 4px; display: inline-block; margin-top: 10px;}
    .modal-actions { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .btn-cancelar-modal, .btn-confirmar-modal { padding: 10px 20px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; }
    .btn-cancelar-modal { background: #f0f0f0; color: #333; }
    .btn-confirmar-modal { background: #d32f2f; color: white; }

    /* ================= MAIN LAYOUT ================= */
    .container { max-width: 1000px; margin: 0 auto; padding: 2rem; font-family: 'Segoe UI', Roboto, sans-serif; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; border-bottom: 3px solid #145214; padding-bottom: 1rem; }
    h1 { color: #145214; margin: 0; font-size: 2.2rem; }
    .btn-new { background-color: #145214; color: white; border: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; cursor: pointer; text-decoration: none; transition: 0.2s; font-size: 1rem; }
    .btn-new:hover { transform: translateY(-2px); background-color: #1e701e; }
    .empty-state { text-align: center; padding: 4rem; background: #f9f9f9; border-radius: 12px; border: 2px dashed #ccc; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .loading { text-align: center; margin-top: 3rem; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(20,82,20,0.3); border-radius: 50%; border-top-color: #145214; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ================= CARD DESIGN ================= */
    .reservas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
    .reserva-card {
      background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      overflow: hidden; border: 1px solid #eee; display: flex; flex-direction: column;
      transition: all 0.3s ease; animation: slideInCard 0.5s ease forwards;
    }
    @keyframes slideInCard { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .reserva-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

    /* Header Tarjeta */
    .card-header {
      background: linear-gradient(135deg, #145214 0%, #2a6e2a 100%);
      color: white; padding: 20px 25px; display: flex; justify-content: space-between; align-items: center;
    }
    .sala-name { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .fecha-badge { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; font-size: 0.95rem; font-weight: 500; backdrop-filter: blur(5px); }

    /* Cuerpo Tarjeta */
    .card-body { padding: 25px; flex-grow: 1; }

    /* --- ESTILO NUEVO PARA TIPO/ASISTENTES (SIN BORDES) --- */
    .info-grid-clean {
      display: flex; 
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .info-clean-item { display: flex; flex-direction: column; flex: 1; }
    .right-align { text-align: right; align-items: flex-end; }
    
    .vertical-divider { width: 1px; height: 40px; background-color: #eee; margin: 0 20px; }

    .label-clean {
      font-size: 0.8rem; color: #888; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;
      display: flex; align-items: center; gap: 5px;
    }
    /* El span right-align necesita justificar el contenido del label a la derecha si usamos flex */
    .right-align .label-clean { justify-content: flex-end; } 

    .icon { font-size: 1rem; filter: grayscale(100%); opacity: 0.7; }
    
    .value-clean {
      font-size: 1.4rem; /* Texto grande */
      color: #222; font-weight: 600; line-height: 1.2;
    }
    /* ----------------------------------------------------- */

    .status-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .label-simple { font-size: 0.9rem; color: #666; font-weight: 600; }
    
    .status-badge { padding: 6px 12px; border-radius: 6px; font-size: 0.9rem; font-weight: 800; letter-spacing: 0.5px; }
    .status-badge.confirmada { background: #e8f5e9; color: #2e7d32; }
    .status-badge.pendiente { background: #fff3e0; color: #f57c00; }

    .services-section { margin-top: 15px; }
    .services-box {
      background: #fafafa; padding: 15px; border-radius: 8px; font-size: 0.95rem;
      color: #666; border-left: 4px solid #ddd; white-space: pre-wrap; line-height: 1.5; margin-top: 8px;
    }
    .services-box.has-services { background: #f1f8e9; color: #33691e; border-left-color: #558b2f; }

    /* Footer / Botones */
    .card-actions { padding: 15px 25px; background: #fcfcfc; border-top: 1px solid #eee; display: flex; gap: 15px; }
    .btn-action {
      flex: 1; padding: 12px; border: none; border-radius: 8px; cursor: pointer;
      font-weight: 600; font-size: 1rem; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s;
    }
    .edit { background: #e3f2fd; color: #1565c0; }
    .edit:hover { background: #bbdefb; transform: translateY(-2px); }
    .delete { background: #ffebee; color: #c62828; }
    .delete:hover { background: #ffcdd2; transform: translateY(-2px); }
  `]
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  loading = true;

  // Variables para Modal y Toast
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
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.loading = false;
      }
    });
  }

  editarReserva(reserva: any) {
    if (!reserva.sala_id) {
        console.error('Error: La reserva no tiene sala_id', reserva);
        return;
    }
    this.router.navigate(['/reservar', reserva.sala_id], { 
      queryParams: { editId: reserva.id } 
    });
  }

  abrirModal(reserva: any) {
    this.reservaAEliminar = reserva;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.reservaAEliminar = null;
  }

  confirmarEliminacion() {
    if (!this.reservaAEliminar) return;

    this.reservasService.eliminarReserva(this.reservaAEliminar.id).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.id !== this.reservaAEliminar.id);
        this.cerrarModal();
        this.mostrarToast('Reserva Cancelada', 'Tu reserva ha sido eliminada correctamente.', false);
      },
      error: (err) => {
        console.error('Error del backend:', err);
        this.cerrarModal();
        this.mostrarToast('Error', 'No se pudo eliminar la reserva. Inténtalo de nuevo.', true);
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