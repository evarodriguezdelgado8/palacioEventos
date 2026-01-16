import { Component } from '@angular/core';

@Component({
    selector: 'app-galeria',
    template: `
    <div class="main-container">
      <section class="principal">
        <h1>Galería de Imágenes</h1>
        <h2>Descubre nuestros espacios en acción</h2>
      </section>

      <section class="eventos-section">
        <div class="eventos-categoria">
            <h3>Celebraciones y Bodas</h3>
            <div class="eventos-gallery">
                <img src="assets/galeria/galeria1.jpg" alt="Boda 1">
                <img src="assets/galeria/galeria3.jpg" alt="Fiesta">
                <img src="assets/galeria/galeria5.png" alt="Detalle Boda">
            </div>
        </div>

        <div class="eventos-categoria">
            <h3>Reuniones Corporativas</h3>
            <div class="eventos-gallery">
                <img src="assets/galeria/galeria2.jpg" alt="Conferencia">
                <img src="assets/galeria/galeria4.png" alt="Reunión">
                 <!-- Reusing image or need another one, using placeholder if needed or existing -->
                <img src="assets/galeria/galeria6.png" alt="Evento Corporativo">
            </div>
        </div>
      </section>
    </div>
  `,
    styles: []
})
export class GaleriaComponent { }
