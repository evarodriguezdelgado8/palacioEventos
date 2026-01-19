import { Component } from '@angular/core';

@Component({
    selector: 'app-informacion-general',
    template: `
    <div class="main-container">
      <!-- Hero Section -->
      <section class="principal">
        <div class="hero-content">
            <h1>Información General</h1>
            <p class="subtitle">Donde la historia y la elegancia se encuentran</p>
        </div>
        <div class="principal-imagen">
             <img src="assets/principal/principal2.jpg" alt="Vista Principal">
        </div>
      </section>

      <!-- About / History Section -->
      <section class="content-section history-section">
        <div class="text-container">
            <h2>Nuestra Historia</h2>
            <p>
                El <strong>Palacio de Eventos</strong> es mucho más que un lugar de celebración; es un emblema de distinción en el corazón de la ciudad. 
                Construido a principios de siglo, nuestro edificio combina la majestuosidad de la arquitectura clásica con las comodidades de la tecnología moderna.
            </p>
            <p>
                Originalmente concebido como residencia aristocrática, hoy abre sus puertas para albergar momentos inolvidables, manteniendo intacta la esencia 
                de lujo y exclusividad que lo ha caracterizado durante décadas. Cada rincón, desde los jardines hasta los salones, cuenta una historia de elegancia atemporal.
            </p>
        </div>
      </section>

      <!-- Philosophy / Vision -->
      <section class="content-section philosophy-section">
          <div class="text-container">
            <h2>Nuestra Filosofía</h2>
            <p>
                Creemos que cada evento es una obra de arte única. Nuestro compromiso es transformar tus sueños en realidad a través de una atención meticulosa al detalle.
                Ya sea una boda íntima, una gala benéfica o una conferencia internacional, nuestro equipo se dedica a crear atmósferas que cautiven y emocionen.
            </p>
          </div>
      </section>

      <!-- Image Carousel / Gallery -->
      <section class="carousel-section">
        <h2>Galería de Espacios y Eventos</h2>
        <p class="carousel-subtitle">Descubre la versatilidad de nuestros salones y la magia de nuestras celebraciones.</p>
        
        <div class="carousel-container">
            <div class="carousel-track">
                <!-- Hall Examples -->
                <div class="carousel-item">
                    <img src="assets/salaEscenica/salaEscenica1.jpg" alt="Sala Escénica">
                    <span>Sala Escénica</span>
                </div>
                <div class="carousel-item">
                    <img src="assets/salaJardin/salaJardin1.jpg" alt="Sala Jardín">
                    <span>Sala Jardín</span>
                </div>
                <div class="carousel-item">
                    <img src="assets/salaModernista/salaModernista1.webp" alt="Sala Modernista">
                    <span>Sala Modernista</span>
                </div>
                <div class="carousel-item">
                    <img src="assets/salaReal/salaReal1.webp" alt="Sala Real">
                    <span>Sala Real</span>
                </div>
                
                <!-- Event Examples -->
                <div class="carousel-item">
                    <img src="assets/galeria/galeria1.jpg" alt="Bodas">
                    <span>Bodas de Ensueño</span>
                </div>
                <div class="carousel-item">
                    <img src="assets/galeria/galeria2.jpg" alt="Corporativo">
                    <span>Eventos Corporativos</span>
                </div>
                <div class="carousel-item">
                    <img src="assets/galeria/galeria3.jpg" alt="Celebraciones">
                    <span>Fiestas Privadas</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .main-container {
        font-family: var(--font-body);
        color: #444;
        line-height: 1.6;
    }

    /* Hero Section */
    .principal {
        position: relative;
        text-align: center;
        margin-bottom: 4rem;
        background: var(--color-light-bg);
        padding: 4rem 2rem;
    }
    .hero-content h1 {
        font-family: var(--font-heading);
        font-size: 3rem;
        color: #222;
        margin-bottom: 0.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
    }
    .subtitle {
        font-size: 1.2rem;
        color: var(--color-gold);
        font-style: italic;
        margin-bottom: 2rem;
    }
    .principal-imagen img {
        max-width: 100%;
        max-height: 500px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    /* Content Sections */
    .content-section {
        padding: 4rem 2rem;
        text-align: center;
    }
    .history-section {
        background: white;
    }
    .philosophy-section {
        background: #f4f4f4;
    }
    .text-container {
        max-width: 800px;
        margin: 0 auto;
    }
    .content-section h2 {
        font-family: var(--font-heading);
        font-size: 2.2rem;
        color: var(--color-dark);
        margin-bottom: 2rem;
        position: relative;
        display: inline-block;
    }
    .content-section h2::after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background: var(--color-gold);
        margin: 10px auto 0;
    }
    .content-section p {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        color: #555;
        text-align: justify; /* Premium feel */
    }

    /* Carousel Section */
    .carousel-section {
        padding: 4rem 2rem;
        background: var(--color-dark);
        color: white;
        text-align: center;
    }
    .carousel-section h2 {
        color: var(--color-gold);
        font-family: var(--font-heading);
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
    }
    .carousel-subtitle {
        color: #aaa;
        margin-bottom: 3rem;
    }
    .carousel-container {
        max-width: 100%;
        overflow-x: auto;
        padding-bottom: 30px;
        /* Hide scrollbar visually but keep functionality */
        scrollbar-width: thin;
        scrollbar-color: var(--color-gold) #444;
    }
    .carousel-track {
        display: flex;
        gap: 30px;
        padding: 0 40px;
        width: max-content; /* Ensure items don't shrink */
    }
    .carousel-item {
        position: relative;
        width: 500px; 
        flex-shrink: 0;
        transition: transform 0.3s;
    }
    .carousel-item:hover {
        transform: scale(1.02);
    }
    .carousel-item img {
        width: 100%;
        height: 350px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .carousel-item span {
        display: block;
        margin-top: 15px;
        font-size: 1.1rem;
        font-weight: 500;
        color: #f2f2f2;
        letter-spacing: 1px;
    }
    `]
})
export class InformacionGeneralComponent { }
