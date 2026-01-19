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
            <!-- SVG Icon: Map Marker -->
            <svg class="footer-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Ubicación">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Calle Principal 123, Sevilla</span>
          </div>
          <div class="contact-item">
            <!-- SVG Icon: Mail -->
            <svg class="footer-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Email">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>info@palacioeventos.com</span>
          </div>
          <div class="contact-item">
            <!-- SVG Icon: Phone -->
            <svg class="footer-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Teléfono">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.25 0 2.45.2 3.57.57.35.13.48.52.24 1.02l-2.2 2.2z"/>
            </svg>
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

    .footer-icon-svg {
      width: 24px;
      height: 24px;
      margin-right: 15px;
      fill: #FFFFFF; /* Default color (replacing filter invert) */
      cursor: pointer;
      transition: fill 0.3s ease;
    }
    
    .footer-icon-svg:hover {
      fill: #145214; /* Corporate Green */
      animation: highJump 0.5s ease infinite alternate;
    }

    @keyframes highJump {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
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
