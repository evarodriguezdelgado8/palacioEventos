import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

@Component({
    selector: 'app-reservas',
    templateUrl: './reservas.component.html',
    styleUrls: ['./reservas.component.scss']
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
    showToast = false;

    // NUEVAS VARIABLES PARA EDICIÓN
    isEditing = false;
    editId: number | null = null;

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

        // 1. COMPROBAR SI ESTAMOS EDITANDO (Viene por Query Params ?editId=5)
        this.route.queryParams.subscribe(params => {
            if (params['editId']) {
                this.isEditing = true;
                this.editId = +params['editId'];
                this.cargarDatosParaEditar(this.editId!);
            } else {
                // 2. MODO CREACIÓN NORMAL (Viene por URL /reservas/:id)
                const salaId = this.route.snapshot.paramMap.get('id');
                if (salaId) {
                    this.cargarDatosSala(+salaId);
                }
            }
        });
    }

    // Carga los datos de la SALA (capacidad, nombre, etc.)
    cargarDatosSala(salaId: number) {
        this.reservaForm.patchValue({ sala_id: salaId });
        this.reservasService.getSalaById(salaId).subscribe(data => {
            this.sala = data;
            const normalized = this.normalizeSalaName(this.sala.nombre);
            this.minAsistentes = (normalized === 'salaJardin') ? 50 : 20;

            // Si NO estamos editando, ponemos el mínimo por defecto
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

    // Carga los datos de la RESERVA existente y rellena el formulario
    cargarDatosParaEditar(id: number) {
        this.loading = true;
        this.reservasService.getReservaById(id).subscribe({
            next: (reserva) => {
                // 1. Primero cargamos la info de la sala
                this.cargarDatosSala(reserva.sala_id);

                // 2. Parsear servicios adicionales
                const tieneServicios = reserva.servicios_adicionales && reserva.servicios_adicionales.includes('Solicitados');

                // 3. Rellenar el formulario
                this.reservaForm.patchValue({
                    sala_id: reserva.sala_id,
                    fecha_evento: reserva.fecha_evento,
                    tipo_evento: reserva.tipo_evento,
                    numero_asistentes: reserva.numero_asistentes,
                    wantsServices: tieneServicios,
                    // Si tienes lógica para extraer teléfono/email del string, iría aquí
                    telefono_contacto: '',
                    email_contacto: ''
                });

                // Activar campos de contacto si es necesario
                this.onServicesToggle();

                // Actualizar calendario visualmente
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
        if (this.reservaForm.invalid || (this.fechaOcupada && !this.isEditing)) {
            // Esto dispara la validación y activa el CSS "Shake" en los inputs
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