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

      <!-- Calendar Visual -->
      <div class="calendar-container" *ngIf="sala">
        <div class="calendar-header">
            <button (click)="prevMonth()">Anterior</button>
            <h3>{{ currentMonthName }} {{ currentYear }}</h3>
            <button (click)="nextMonth()">Siguiente</button>
        </div>
        <div class="calendar-grid">
            <div class="weekday">Dom</div><div class="weekday">Lun</div><div class="weekday">Mar</div>
            <div class="weekday">Mié</div><div class="weekday">Jue</div><div class="weekday">Vie</div><div class="weekday">Sáb</div>
            
            <div *ngFor="let day of calendarDays" 
                 class="day" 
                 [ngClass]="{
                    'empty': !day, 
                    'occupied': isOccupied(day), 
                    'selected': isSelected(day),
                    'past': isPast(day)
                 }"
                 (click)="selectDate(day)">
                {{ day }}
            </div>
        </div>
        <div class="calendar-legend">
            <span class="legend-item"><span class="dot available"></span> Disponible</span>
            <span class="legend-item"><span class="dot occupied"></span> Ocupado</span>
            <span class="legend-item"><span class="dot selected"></span> Seleccionado</span>
        </div>
      </div>

      <form [formGroup]="reservaForm" (ngSubmit)="onSubmit()" class="form-section">
        <div class="form-group">
          <label for="fecha_evento">Fecha del Evento</label>
          <input type="text" id="fecha_evento" formControlName="fecha_evento" readonly /> 
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
          <label for="numero_asistentes">Número de Asistentes (Mín: {{ minAsistentes }} - Máx: {{ sala?.capacidad }})</label>
          <input type="number" id="numero_asistentes" formControlName="numero_asistentes" />
           <div *ngIf="reservaForm.controls['numero_asistentes'].errors?.['max']" style="color: red;">
              Excede la capacidad de la sala.
           </div>
           <div *ngIf="reservaForm.controls['numero_asistentes'].errors?.['min']" style="color: red;">
              El número de asistentes no puede ser inferior a {{ minAsistentes }}.
           </div>
        </div>

        <!-- Additional Services Toggle -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
              <input type="checkbox" formControlName="wantsServices" (change)="onServicesToggle()">
              ¿Desea contratar servicios adicionales?
          </label>
        </div>

        <!-- Conditional Contact Fields -->
        <div *ngIf="showContactFields" class="contact-fields-container">
            <p class="info-message">
                <span class="info-icon">ℹ️</span> Serán contactados para información acerca de servicios adicionales.
            </p>
            <div class="form-group">
                <label for="telefono_contacto">Teléfono de Contacto</label>
                <input type="tel" id="telefono_contacto" formControlName="telefono_contacto" placeholder="+34 600 000 000" />
            </div>
            <div class="form-group">
                <label for="email_contacto">Email de Contacto</label>
                <input type="email" id="email_contacto" formControlName="email_contacto" placeholder="ejemplo@correo.com" />
            </div>
        </div>

        <div *ngIf="error" style="color: red; text-align: center;">{{ error }}</div>

        <button type="submit" [disabled]="reservaForm.invalid || loading || fechaOcupada" class="submit-button">
          {{ loading ? 'Procesando...' : 'Confirmar Reserva' }}
        </button>
      </form>
    </div>
  `,
    styles: [`
    .calendar-container {
        max-width: 400px;
        margin: 0 auto 3rem;
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .calendar-header button {
        background: #145214;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        text-align: center;
    }
    .weekday {
        font-weight: bold;
        font-size: 0.8rem;
        color: #666;
        padding-bottom: 5px;
    }
    .day {
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        background: #f0f0f0;
        transition: background 0.2s;
    }
    .day.empty {
        background: transparent;
        cursor: default;
    }
    .day:not(.empty):hover {
        background: #e0e0e0;
    }
    .day.occupied {
        background: #ffcccc;
        color: #a00;
        cursor: not-allowed;
        text-decoration: line-through;
    }
    .day.selected {
        background: #145214;
        color: #fff;
    }
    .day.past {
        background: #eee;
        color: #ccc;
        cursor: not-allowed;
    }
    .calendar-legend {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        gap: 15px;
        font-size: 0.8rem;
    }
    .legend-item { display: flex; align-items: center; gap: 5px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .dot.available { background: #f0f0f0; border: 1px solid #ccc; }
    .dot.occupied { background: #ffcccc; }
    .dot.selected { background: #145214; }

    /* New Styles */
    .checkbox-group {
        display: flex;
        align-items: center;
        background: #e8f5e9;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    .checkbox-label {
        font-weight: 600;
        color: #145214;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 0;
    }
    .checkbox-label input {
        width: 20px !important;
        height: 20px;
        margin: 0;
    }
    .contact-fields-container {
        border-left: 3px solid #145214;
        padding-left: 1.5rem;
        margin-bottom: 2rem;
        animation: fadeIn 0.3s ease;
    }
    .info-message {
        background-color: #f0f4c3;
        color: #555;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ReservasComponent implements OnInit {
    reservaForm: FormGroup;
    sala: any;
    loading = false;
    error = '';
    fechaOcupada = false;
    fechasNoDisponibles: string[] = [];
    minAsistentes = 1;

    showContactFields = false;

    // Calendar State
    currentDate = new Date();
    currentMonth = this.currentDate.getMonth();
    currentYear = this.currentDate.getFullYear();
    calendarDays: (number | null)[] = [];
    monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
            wantsServices: [false],
            telefono_contacto: [''],
            email_contacto: ['']
        });
    }

    ngOnInit() {
        this.generateCalendar();
        const salaId = this.route.snapshot.paramMap.get('id');
        if (salaId) {
            this.reservaForm.patchValue({ sala_id: salaId });
            this.reservasService.getSalaById(+salaId).subscribe(data => {
                this.sala = data;

                // Determine Minimum Assistants logic
                const normalized = this.normalizeSalaName(this.sala.nombre);
                this.minAsistentes = (normalized === 'salaJardin') ? 50 : 20;

                this.reservaForm.get('numero_asistentes')?.setValidators([
                    Validators.required,
                    Validators.min(this.minAsistentes),
                    Validators.max(this.sala.capacidad)
                ]);
                this.reservaForm.get('numero_asistentes')?.updateValueAndValidity();

                this.loadDisponibilidad(+salaId);
            });
        }
    }

    // Toggle logic for additional services
    onServicesToggle() {
        this.showContactFields = this.reservaForm.get('wantsServices')?.value;
        const phoneControl = this.reservaForm.get('telefono_contacto');
        const emailControl = this.reservaForm.get('email_contacto');

        if (this.showContactFields) {
            phoneControl?.setValidators([Validators.required]);
            emailControl?.setValidators([Validators.required, Validators.email]);
        } else {
            phoneControl?.clearValidators();
            emailControl?.clearValidators();
            phoneControl?.setValue('');
            emailControl?.setValue('');
        }
        phoneControl?.updateValueAndValidity();
        emailControl?.updateValueAndValidity();
    }

    // Reuse normalization logic
    private normalizeSalaName(nombre: string): string {
        if (!nombre) return '';
        const lower = nombre.toLowerCase();
        if (lower.includes('escénica') || lower.includes('escenica')) return 'salaEscenica';
        if (lower.includes('jardín') || lower.includes('jardin')) return 'salaJardin';
        if (lower.includes('modernista')) return 'salaModernista';
        if (lower.includes('real')) return 'salaReal';
        return 'salaEscenica';
    }

    get currentMonthName() {
        return this.monthNames[this.currentMonth];
    }

    loadDisponibilidad(salaId: number) {
        this.reservasService.getDisponibilidad(salaId).subscribe(fechas => {
            this.fechasNoDisponibles = fechas;
            this.generateCalendar();
        });
    }

    generateCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        this.calendarDays = [];

        for (let i = 0; i < startDay; i++) {
            this.calendarDays.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            this.calendarDays.push(i);
        }
    }

    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.generateCalendar();
    }

    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.generateCalendar();
    }

    formatDate(day: number): string {
        const month = (this.currentMonth + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        return `${this.currentYear}-${month}-${d}`;
    }

    isOccupied(day: number | null): boolean {
        if (!day) return false;
        return this.fechasNoDisponibles.includes(this.formatDate(day));
    }

    isSelected(day: number | null): boolean {
        if (!day) return false;
        return this.reservaForm.get('fecha_evento')?.value === this.formatDate(day);
    }

    isPast(day: number | null): boolean {
        if (!day) return false;
        const date = new Date(this.currentYear, this.currentMonth, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    selectDate(day: number | null) {
        if (!day) return;
        if (this.isOccupied(day) || this.isPast(day)) return;

        const dateStr = this.formatDate(day);
        this.reservaForm.patchValue({ fecha_evento: dateStr });
        this.fechaOcupada = false;
    }

    onSubmit() {
        if (this.reservaForm.invalid || this.fechaOcupada) {
            // Mark all as touched to show errors
            this.reservaForm.markAllAsTouched();
            return;
        }

        this.loading = true;

        // Prepare payload: format 'servicios_adicionales' string based on fields
        const formVal = this.reservaForm.value;
        let serviciosStr = 'No solicitados';

        if (formVal.wantsServices) {
            serviciosStr = `Solicitados. Contacto: ${formVal.telefono_contacto || 'N/A'}, Email: ${formVal.email_contacto || 'N/A'}`;
        }

        const payload = {
            sala_id: formVal.sala_id,
            fecha_evento: formVal.fecha_evento,
            tipo_evento: formVal.tipo_evento,
            numero_asistentes: formVal.numero_asistentes,
            servicios_adicionales: serviciosStr
        };

        this.reservasService.crearReserva(payload).subscribe({
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
