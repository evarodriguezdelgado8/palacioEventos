import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { InformacionGeneralComponent } from './pages/informacion-general/informacion-general.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import { ConfirmacionReservaComponent } from './pages/confirmacion-reserva/confirmacion-reserva.component';
import { LoginComponent } from './pages/login/login.component';

import { SalaEscenicaComponent } from './pages/salas/sala-escenica/sala-escenica.component';
import { SalaJardinComponent } from './pages/salas/sala-jardin/sala-jardin.component';
import { SalaModernistaComponent } from './pages/salas/sala-modernista/sala-modernista.component';
import { SalaRealComponent } from './pages/salas/sala-real/sala-real.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'informacion-general', component: InformacionGeneralComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'confirmacion-reserva', component: ConfirmacionReservaComponent },
  { path: 'login', component: LoginComponent },

  { path: 'salas/escenica', component: SalaEscenicaComponent },
  { path: 'salas/jardin', component: SalaJardinComponent },
  { path: 'salas/modernista', component: SalaModernistaComponent },
  { path: 'salas/real', component: SalaRealComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
