import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  template: `
    <div class="login-container">
      <h1>Registro de Usuario</h1>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input type="text" id="nombre" formControlName="nombre" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" formControlName="email" />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div style="position: relative;">
              <input [type]="showPassword ? 'text' : 'password'" id="password" formControlName="password" style="padding-right: 4.5rem;" />
              <span (click)="togglePassword()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--color-gold); font-size: 0.9rem; font-weight: 600;">
                  {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </span>
          </div>
        </div>
        <div *ngIf="error" style="color: red; margin-bottom: 1rem; text-align: center;">{{ error }}</div>
        <button [disabled]="loading" class="login-button">
          <span *ngIf="loading">Registrando...</span>
          <span *ngIf="!loading">Registrarse</span>
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class RegistroComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.registro(this.registerForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: error => {
          this.error = error.error ? error.error.error : 'Error en el registro';
          this.loading = false;
        }
      });
  }
}
