import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
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