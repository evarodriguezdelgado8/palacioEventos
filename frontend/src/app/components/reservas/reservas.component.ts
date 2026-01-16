import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

@Component({
    selector: 'app-reservas',
    template: `
    <div class="reservas-container">
      <h1>Reservar Sala</h1>
      <p class="reservas-intro" *ngIf="sala">Estás reservando: <strong>{{ sala.nombre }}</strong></p>

      <form [formGroup]="reservaForm" (ngSubmit)="onSubmit()" class="form-section">
        <div class="form-group">
          <label for="fecha_evento">Fecha del Evento</label>
          <input type="date" id="fecha_evento" formControlName="fecha_evento" (change)="checkDisponibilidad()" />
          <div *ngIf="fechaOcupada" style="color: red;">La fecha seleccionada no está disponible.</div>
        </div>

        <div class="form-group">
          <label for="tipo_evento">Tipo de Evento</label>
          <select id="tipo_evento" formControlName="tipo_evento">
            <option value="Boda">Boda</option>
            <option value="Conferencia">Conferencia</option>
            <option value="Fiesta">Fiesta</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="numero_asistentes">Número de Asistentes (Máx: {{ sala?.capacidad }})</label>
          <input type="number" id="numero_asistentes" formControlName="numero_asistentes" />
           <div *ngIf="reservaForm.controls['numero_asistentes'].errors?.['max']" style="color: red;">
              Excede la capacidad de la sala.
           </div>
        </div>

        <div class="form-group">
          <label for="servicios_adicionales">Servicios Adicionales</label>
          <textarea id="servicios_adicionales" formControlName="servicios_adicionales"></textarea>
        </div>

        <div *ngIf="error" style="color: red; text-align: center;">{{ error }}</div>

        <button type="submit" [disabled]="reservaForm.invalid || loading || fechaOcupada" class="submit-button">
          {{ loading ? 'Procesando...' : 'Confirmar Reserva' }}
        </button>
      </form>
    </div>
  `,
    styles: []
})
export class ReservasComponent implements OnInit {
    reservaForm: FormGroup;
    sala: any;
    loading = false;
    error = '';
    fechaOcupada = false;
    fechasNoDisponibles: string[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private reservasService: ReservasService
    ) {
        this.reservaForm = this.formBuilder.group({
            sala_id: [''],
            fecha_evento: ['', Validators.required],
            tipo_evento: ['Boda', Validators.required],
            numero_asistentes: ['', Validators.required],
            servicios_adicionales: ['']
        });
    }

    ngOnInit() {
        const salaId = this.route.snapshot.paramMap.get('id');
        if (salaId) {
            this.reservaForm.patchValue({ sala_id: salaId });
            this.reservasService.getSalaById(+salaId).subscribe(data => {
                this.sala = data;
                // Update validator dynamically based on capacity
                this.reservaForm.get('numero_asistentes')?.setValidators([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(this.sala.capacidad)
                ]);
                this.loadDisponibilidad(+salaId);
            });
        }
    }

    loadDisponibilidad(salaId: number) {
        this.reservasService.getDisponibilidad(salaId).subscribe(fechas => {
            this.fechasNoDisponibles = fechas;
        });
    }

    checkDisponibilidad() {
        const fechaSeleccionada = this.reservaForm.get('fecha_evento')?.value;
        if (fechaSeleccionada && this.fechasNoDisponibles.includes(fechaSeleccionada)) {
            this.fechaOcupada = true;
        } else {
            this.fechaOcupada = false;
        }
    }

    onSubmit() {
        if (this.reservaForm.invalid || this.fechaOcupada) return;

        this.loading = true;
        this.reservasService.crearReserva(this.reservaForm.value).subscribe({
            next: () => {
                alert('Reserva creada con éxito!');
                this.router.navigate(['/mis-reservas']);
            },
            error: (err) => {
                this.error = err.error?.error || 'Error al crear la reserva';
                this.loading = false;
            }
        });
    }
}
