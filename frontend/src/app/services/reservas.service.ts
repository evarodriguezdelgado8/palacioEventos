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
}
