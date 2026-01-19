import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-container">
        <!-- Contact Section -->
        <div class="footer-section contact-info">
          <h3>Contacto</h3>
          <div class="contact-item">
            <img src="assets/iconos/maps.png" alt="Ubicación">
            <span>Calle Principal 123, Sevilla</span>
          </div>
          <div class="contact-item">
            <img src="assets/iconos/mail.png" alt="Email">
            <span>info@palacioeventos.com</span>
          </div>
          <div class="contact-item">
            <img src="assets/iconos/phone.png" alt="Teléfono">
            <span>+34 912 345 678</span>
          </div>
        </div>

        <!-- Social Section -->
        <div class="footer-section social-links">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>

        <!-- Map Section -->
        <div class="footer-section map-container">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12674.375634563!2d-5.996291!3d37.377319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126c210d54a5c5%3A0x6b412964c2390c5a!2sParque%20de%20Mar%C3%ADa%20Luisa!5e0!3m2!1sen!2ses!4v1705680000000!5m2!1sen!2ses" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Palacio de Eventos. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-dark); /* Dark Gray */
      color: #f2f2f2;
      padding: 40px 20px 20px;
      font-family: var(--font-body);
    }

    .footer-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 30px;
    }

    .footer-section {
      flex: 1 1 250px; /* Responsive sizing */
      min-width: 250px;
    }

    .footer-section h3 {
      color: var(--color-gold); /* Gold accent for headers */
      font-family: var(--font-heading);
      font-size: 1.2rem;
      margin-bottom: 20px;
      border-bottom: 2px solid #555;
      padding-bottom: 10px;
      display: inline-block;
    }

    /* Contact Info Styles */
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .contact-item img {
      width: 24px;
      height: 24px;
      margin-right: 15px;
      filter: invert(1); /* Make icons white if they are black SVG/PNGs */
    }

    .contact-item span {
      font-size: 0.95rem;
    }

    /* Social Links Styles */
    .social-links ul {
      list-style: none;
      padding: 0;
    }

    .social-links li {
      margin-bottom: 10px;
    }

    .social-links a {
      color: #f2f2f2;
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 1rem;
    }

    .social-links a:hover {
      color: var(--color-gold); /* Gold hover */
      padding-left: 5px; /* Subtle movement */
    }

    /* Map Styles */
    .map-container {
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }

    /* Footer Bottom */
    .footer-bottom {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #444;
      font-size: 0.85rem;
      color: #aaa;
    }
  `]
})
export class FooterComponent { }
