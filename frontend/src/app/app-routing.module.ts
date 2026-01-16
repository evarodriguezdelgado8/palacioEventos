import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SalaDetailComponent } from './components/sala-detail/sala-detail.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'salas/:id', component: SalaDetailComponent },
  { path: 'reservar/:id', component: ReservasComponent, canActivate: [AuthGuard] },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
