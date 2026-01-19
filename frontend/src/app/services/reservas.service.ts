import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservasService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getAllSalas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/salas`);
    }

    getSalaById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/salas/${id}`);
    }

    getDisponibilidad(salaId: number): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/reservas/disponibilidad/${salaId}`);
    }

    crearReserva(reserva: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/reservas`, reserva);
    }

    getMisReservas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/reservas/mis-reservas`);
    }

    eliminarReserva(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/reservas/${id}`);
    }

    // 1. Obtener una única reserva por ID (para rellenar el formulario al editar)
    getReservaById(id: number): Observable<any> {
        // Nota: Quizás necesites crear este endpoint en el backend si no lo tienes,
        // PERO por ahora podemos intentar reutilizar la lógica o filtrar en el front.
        // Lo ideal es tener: router.get('/:id', ...) en el backend.
        // Si no quieres tocar más el backend, te enseñaré un truco en el componente.
        return this.http.get<any>(`${this.apiUrl}/reservas/${id}`);
    }

    // 2. Actualizar la reserva
    actualizarReserva(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/reservas/${id}`, data);
    }
}
