import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  // AÑADIMOS LOS ESTILOS CSS AQUÍ PARA LAS ANIMACIONES
  styles: [`
    /* 1. Animación del Spinner (Carga) */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 3px solid #ffffff;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      display: inline-block;
      vertical-align: middle;
    }

    /* 2. Animación Shake (Error) */
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .shake-animation {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      border: 2px solid red !important; /* Forzamos grosor y color */
      background-color: #ffe6e6 !important; /* Un fondo rojo muy suave para que se note más */
      box-shadow: 0 0 5px red !important; /* Un resplandor rojo */
    }

    /* Estilo base para centrar contenido del botón */
    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  `],
  template: `
    <div class="login-container">
      <h1>Iniciar Sesión</h1>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="text" 
            id="email" 
            formControlName="email" 
            class="form-control" 
            [ngClass]="{ 
              'is-invalid': submitted && f['email'].errors,
              'shake-animation': submitted && f['email'].errors 
            }" 
          />
          <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
            <div *ngIf="f['email'].errors['required']">Email es requerido</div>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div style="position: relative;">
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              [ngClass]="{ 
                'is-invalid': submitted && f['password'].errors,
                'shake-animation': submitted && f['password'].errors
              }" 
              style="padding-right: 4.5rem;" 
            />
            <span (click)="togglePassword()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--color-gold); font-size: 0.9rem; font-weight: 600;">
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </span>
          </div>
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            <div *ngIf="f['password'].errors['required']">Contraseña es requerida</div>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger" style="color: red; margin-bottom: 1rem; text-align: center;">{{ error }}</div>
        
        <button [disabled]="loading" class="login-button">
          <div class="btn-content">
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Ingresar</span>
            <span *ngIf="loading">Verificando...</span>
          </div>
        </button>

        <div style="margin-top: 2rem; text-align: center;">
            <a routerLink="/registro" style="color: #145214; font-weight: 600;">¿No tienes cuenta? Regístrate aquí</a>
        </div>
      </form>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Si el formulario es inválido, el HTML detectará 'submitted' y activará la clase 'shake-animation'
    if (this.loginForm.invalid) {
      // Pequeño truco: hacemos vibrar y luego quitamos la animación para que pueda vibrar de nuevo si pulsa otra vez
      setTimeout(() => this.submitted = false, 1000); 
      return; // Detenemos aquí
    }

    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error.error ? error.error.error : 'Error en el login';
          this.loading = false;
        }
      });
  }
}