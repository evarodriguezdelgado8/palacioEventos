import { Component } from '@angular/core';

@Component({
  selector: 'app-informacion-general',
  template: `
    <div class="main-container">
      <section class="principal">
        <h1>Información General</h1>
        <div class="principal-imagen">
             <img src="assets/principal/principal2.jpg" alt="Información General">
        </div>
      </section>

      <section class="descripcion">
        <p>Sobre Palacio de Eventos</p>
        <p>Somos un espacio único dedicado a la celebración de todo tipo de eventos, desde bodas íntimas hasta grandes conferencias corporativas. Nuestras instalaciones combinan historia, modernidad y naturaleza para ofrecer el ambiente perfecto para cada ocasión.</p>
        <p>Contamos con aparcamiento privado, servicios de catering de alta cocina y un equipo de profesionales dedicados a que tu evento sea un éxito rotundo.</p>
      </section>

      <section class="eventos-section">
        <h2>Nuestros Eventos</h2>
        <div class="eventos-gallery">
            <img src="assets/galeria/galeria1.jpg" alt="Boda">
            <img src="assets/galeria/galeria2.jpg" alt="Conferencia">
            <img src="assets/galeria/galeria3.jpg" alt="Fiesta">
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class InformacionGeneralComponent { }
