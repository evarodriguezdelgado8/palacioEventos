import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InformacionGeneralComponent,
    GaleriaComponent,
    ReservasComponent,
    ConfirmacionReservaComponent,
    LoginComponent,
    SalaEscenicaComponent,
    SalaJardinComponent,
    SalaModernistaComponent,
    SalaRealComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
