import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h3>Contacto</h3>
          <p><img src="assets/iconos/maps.png" alt="Address" style="width: 20px; vertical-align: middle; margin-right: 10px;"> Calle Principal 123, Ciudad</p>
          <p><img src="assets/iconos/mail.png" alt="Email" style="width: 20px; vertical-align: middle; margin-right: 10px;"> info@palacioeventos.com</p>
          <p><img src="assets/iconos/phone.png" alt="Phone" style="width: 20px; vertical-align: middle; margin-right: 10px;"> +34 912 345 678</p>
        </div>
        <div class="footer-section">
          <h3>Síguenos</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
        </div>
        <div class="footer-map">
             <img src="assets/mapa.png" alt="Ubicación en Mapa" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
