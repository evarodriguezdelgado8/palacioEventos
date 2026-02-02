import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

interface CalendarDay {
    day: number | null;
    dateStr: string;
    isPadding: boolean;
    status: 'occupied' | 'past' | 'available' | 'padding';
    fullLabel: string;
}

@Component({
    selector: 'app-reservas',
    templateUrl: './reservas.component.html',
    styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
    @ViewChildren('dayBtn') dayButtons!: QueryList<ElementRef>;

    reservaForm: FormGroup;
    sala: any;
    loading = false;
    error = '';
    fechaOcupada = false;
    fechasNoDisponibles: string[] = [];
    minAsistentes = 1;

    showContactFields = false;
    showToast = false;

    // NUEVAS VARIABLES PARA EDICIÓN
    isEditing = false;
    editId: number | null = null;

    // Calendar State
    currentDate = new Date();
    currentMonth = this.currentDate.getMonth();
    currentYear = this.currentDate.getFullYear();

    // Accessibility: Weeks Matrix instead of flat array
    calendarWeeks: CalendarDay[][] = [];
    monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthAnnouncement = ''; // For aria-live region

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

        // 1. COMPROBAR SI ESTAMOS EDITANDO
        this.route.queryParams.subscribe(params => {
            if (params['editId']) {
                this.isEditing = true;
                this.editId = +params['editId'];
                this.cargarDatosParaEditar(this.editId!);
            } else {
                // 2. MODO CREACIÓN NORMAL
                const salaId = this.route.snapshot.paramMap.get('id');
                if (salaId) {
                    this.cargarDatosSala(+salaId);
                }
            }
        });
    }

    // Carga los datos de la SALA
    cargarDatosSala(salaId: number) {
        this.reservaForm.patchValue({ sala_id: salaId });
        this.reservasService.getSalaById(salaId).subscribe(data => {
            this.sala = data;
            const normalized = this.normalizeSalaName(this.sala.nombre);
            this.minAsistentes = (normalized === 'salaJardin') ? 50 : 20;

            if (!this.isEditing) {
                this.reservaForm.patchValue({ numero_asistentes: this.minAsistentes });
            }

            this.reservaForm.get('numero_asistentes')?.setValidators([
                Validators.required,
                Validators.min(this.minAsistentes),
                Validators.max(this.sala.capacidad)
            ]);
            this.reservaForm.get('numero_asistentes')?.updateValueAndValidity();

            this.loadDisponibilidad(salaId);
        });
    }

    // Carga los datos de la RESERVA existente
    cargarDatosParaEditar(id: number) {
        this.loading = true;
        this.reservasService.getReservaById(id).subscribe({
            next: (reserva) => {
                this.cargarDatosSala(reserva.sala_id);
                const tieneServicios = reserva.servicios_adicionales && reserva.servicios_adicionales.includes('Solicitados');

                this.reservaForm.patchValue({
                    sala_id: reserva.sala_id,
                    fecha_evento: reserva.fecha_evento,
                    tipo_evento: reserva.tipo_evento,
                    numero_asistentes: reserva.numero_asistentes,
                    wantsServices: tieneServicios,
                    telefono_contacto: '',
                    email_contacto: ''
                });

                this.onServicesToggle();

                const fechaDate = new Date(reserva.fecha_evento);
                this.currentMonth = fechaDate.getMonth();
                this.currentYear = fechaDate.getFullYear();
                this.generateCalendar();

                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'No se pudo cargar la reserva para editar.';
                this.loading = false;
            }
        });
    }

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
            if (!this.isEditing) {
                phoneControl?.setValue('');
                emailControl?.setValue('');
            }
        }
        phoneControl?.updateValueAndValidity();
        emailControl?.updateValueAndValidity();
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

    get currentMonthName() {
        return this.monthNames[this.currentMonth];
    }

    loadDisponibilidad(salaId: number) {
        this.reservasService.getDisponibilidad(salaId).subscribe(fechas => {
            if (this.isEditing) {
                const fechaActual = this.reservaForm.get('fecha_evento')?.value;
                this.fechasNoDisponibles = fechas.filter(f => f !== fechaActual);
            } else {
                this.fechasNoDisponibles = fechas;
            }
            this.generateCalendar();
        });
    }

    updateMonthAnnouncement() {
        this.monthAnnouncement = `${this.currentMonthName} ${this.currentYear}`;
    }

    generateCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay(); // 0 = Sunday

        const flatDays: CalendarDay[] = [];

        // Padding start
        for (let i = 0; i < startDay; i++) {
            flatDays.push({ day: null, dateStr: '', isPadding: true, status: 'padding', fullLabel: '' });
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = this.formatDate(i);
            const isOccupied = this.fechasNoDisponibles.includes(dateStr);
            const isPast = this.checkIsPast(i);

            let status: 'occupied' | 'past' | 'available' = 'available';
            if (isPast) status = 'past';
            else if (isOccupied) status = 'occupied';

            // ARIA Label generation
            const dateObj = new Date(this.currentYear, this.currentMonth, i);
            const weekdayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
            const monthName = this.monthNames[this.currentMonth];
            const statusText = status === 'occupied' ? 'Ocupado' : (status === 'past' ? 'No disponible' : 'Disponible');

            const fullLabel = `${weekdayName} ${i} de ${monthName}, ${statusText}`;

            flatDays.push({
                day: i,
                dateStr: dateStr,
                isPadding: false,
                status: status,
                fullLabel: fullLabel
            });
        }

        // Chunk into weeks
        this.calendarWeeks = [];
        let week: CalendarDay[] = [];
        for (let i = 0; i < flatDays.length; i++) {
            week.push(flatDays[i]);
            if (week.length === 7) {
                this.calendarWeeks.push(week);
                week = [];
            }
        }
        if (week.length > 0) {
            // Fill remaining week with padding
            while (week.length < 7) {
                week.push({ day: null, dateStr: '', isPadding: true, status: 'padding', fullLabel: '' });
            }
            this.calendarWeeks.push(week);
        }

        this.updateMonthAnnouncement();
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

    checkIsPast(day: number): boolean {
        const date = new Date(this.currentYear, this.currentMonth, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    isSelected(dateStr: string): boolean {
        return this.reservaForm.get('fecha_evento')?.value === dateStr;
    }

    // Keyboard Navigation: Roving Tabindex
    getTabindex(day: CalendarDay): number {
        if (day.isPadding) return -1;

        const selectedDate = this.reservaForm.get('fecha_evento')?.value;
        if (selectedDate && day.dateStr === selectedDate) {
            return 0;
        }

        // If no date selected, focus first available day? Or just day 1 if available?
        // Default logic: If no selection, day 1 is tabindex 0 (handled by focus logic usually)
        // Simplified: If no selection matches, and it is the first valid day of month?
        // For roving tabindex perfect implementation, we usually track 'focusedDay' state. 
        // Here we rely on 'selected' or 'first of month'.

        if (!selectedDate && day.day === 1) return 0;

        return -1;
    }

    selectDay(day: CalendarDay) {
        if (day.isPadding || day.status === 'occupied' || day.status === 'past') return;
        this.reservaForm.patchValue({ fecha_evento: day.dateStr });
        this.fechaOcupada = false;
    }

    onKeydown(event: KeyboardEvent, day: CalendarDay, weekIndex: number, dayIndex: number) {
        if (day.isPadding) return;

        const maxWeeks = this.calendarWeeks.length;
        let nextWeek = weekIndex;
        let nextDay = dayIndex;
        let handled = false;

        switch (event.key) {
            case 'ArrowRight':
                nextDay++;
                if (nextDay > 6) { nextDay = 0; nextWeek++; }
                handled = true;
                break;
            case 'ArrowLeft':
                nextDay--;
                if (nextDay < 0) { nextDay = 6; nextWeek--; }
                handled = true;
                break;
            case 'ArrowDown':
                nextWeek++;
                handled = true;
                break;
            case 'ArrowUp':
                nextWeek--;
                handled = true;
                break;
            case 'Home':
                // Optional: Move to start of row or month
                handled = true;
                break;
            case 'End':
                // Optional
                handled = true;
                break;
        }

        if (handled) {
            event.preventDefault();
            this.focusDay(nextWeek, nextDay);
        }
    }

    focusDay(weekIdx: number, dayIdx: number) {
        if (weekIdx < 0 || weekIdx >= this.calendarWeeks.length) return; // Out of month

        const targetDay = this.calendarWeeks[weekIdx][dayIdx];
        if (!targetDay || targetDay.isPadding) {
            // Try to find nearest valid? Or just abort.
            // Simplified: If padding, try moving again in direction? 
            // For now, simple boundary check.
            return;
        }

        // Find the button element
        // We flatten the list of buttons and find index?
        // Easier: Give IDs or use logic to find index in flattened list.
        // weekIdx * 7 + dayIdx = flat index (including padding)

        const flatIndex = (weekIdx * 7) + dayIdx;
        const buttons = this.dayButtons.toArray();
        if (buttons[flatIndex]) {
            buttons[flatIndex].nativeElement.focus();
        }
    }

    onSubmit() {
        if (this.reservaForm.invalid || (this.fechaOcupada && !this.isEditing)) {
            this.reservaForm.markAllAsTouched();
            return;
        }

        this.loading = true;

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

        if (this.isEditing && this.editId) {
            this.reservasService.actualizarReserva(this.editId, payload).subscribe({
                next: () => {
                    this.loading = false;
                    this.showToast = true;
                    setTimeout(() => {
                        this.router.navigate(['/mis-reservas']);
                    }, 3000);
                },
                error: (err) => {
                    this.error = err.error?.error || 'Error al actualizar la reserva';
                    this.loading = false;
                }
            });
        } else {
            this.reservasService.crearReserva(payload).subscribe({
                next: () => {
                    this.loading = false;
                    this.showToast = true;
                    setTimeout(() => {
                        this.router.navigate(['/mis-reservas']);
                    }, 4000);
                },
                error: (err) => {
                    this.error = err.error?.error || 'Error al crear la reserva';
                    this.loading = false;
                }
            });
        }
    }
}