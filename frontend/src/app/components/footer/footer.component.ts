import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h3>Contacto</h3>
          <p>Calle Principal 123, Ciudad</p>
          <p>info@palacioeventos.com</p>
          <p>+34 912 345 678</p>
        </div>
        <div class="footer-section">
          <h3>Síguenos</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
        </div>
        <div class="footer-map">
            <!-- Placeholder map -->
             <div style="background: #eee; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">Mapa</div>
        </div>
      </div>
    </footer>
  `,
    styles: []
})
export class FooterComponent { }
