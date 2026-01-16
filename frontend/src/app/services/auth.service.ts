import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private router: Router) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return localStorage.getItem('token');
    }

    registro(usuario: any) {
        return this.http.post(`${this.apiUrl}/registro`, usuario);
    }

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials)
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (response && response.token) {
                    localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response.usuario);
                }
                return response;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }
}
