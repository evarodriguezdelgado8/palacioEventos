import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

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
            <img src="assets/galeria/galeria2.jpg" alt="Conferencia">
          </div>

          <!-- Bloque A: Hero Multimedia (VIDEO HTML5 + 2 formatos + controles personalizados) -->
          <div class="galeria-video-card">
            <h4 class="galeria-video-title">Vídeo destacado</h4>

            <div class="galeria-video-wrapper" (click)="togglePlay()">
              <video
                #bodaVideo
                class="galeria-video"
                preload="metadata"
                playsinline
                muted
                loop
                (loadedmetadata)="onLoadedMetadata()"
                (timeupdate)="onTimeUpdate()"
              >
                <source src="assets/videos/bodaEjemplo.webm" type="video/webm" />
                <source src="assets/videos/bodaEjemplo.mp4" type="video/mp4" />
                Tu navegador no soporta vídeo HTML5.
              </video>

              <div class="galeria-video-gradient"></div>

              <div class="galeria-video-controls" (click)="$event.stopPropagation()">
                <button type="button" class="galeria-video-btn" (click)="togglePlay($event)">
                  {{ isPlaying ? '⏸ Pausar' : '▶ Reproducir' }}
                </button>

                <div class="galeria-progress" (click)="seek($event)" aria-label="Progreso del vídeo">
                  <div class="galeria-progress__fill" [style.width.%]="progress"></div>
                </div>

                <button type="button" class="galeria-video-btn galeria-video-btn--ghost" (click)="toggleMute($event)">
                  {{ isMuted ? '🔇' : '🔊' }}
                </button>

                <span class="galeria-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
              </div>
            </div>

            <p class="galeria-video-hint">
              Consejo: haz clic en el vídeo para reproducir/pausar. Puedes saltar haciendo clic en la barra.
            </p>
          </div>
        </div>

        <div class="eventos-categoria">
          <h3>Reuniones Corporativas</h3>
          <div class="eventos-gallery">
            <img src="assets/galeria/galeria5.png" alt="Detalle Boda">
            <img src="assets/galeria/galeria4.png" alt="Reunión">
            <img src="assets/galeria/galeria6.png" alt="Evento Corporativo">
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* estilos del bloque de video */
    
    .galeria-video-card {
      margin-top: 24px;
      padding: 18px;
      border-radius: 12px;
      background: rgba(0,0,0,0.04);
    }

    .galeria-video-title {
      margin: 0 0 12px;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .galeria-video-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
    }

    .galeria-video {
      width: 100%;
      display: block;
      max-height: 520px;
      object-fit: cover;
      transform: scale(1.01);
      transition: transform 250ms ease;
    }

    .galeria-video-wrapper:hover .galeria-video {
      transform: scale(1.03);
    }

    .galeria-video-gradient {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(0,0,0,0.08) 0%,
        rgba(0,0,0,0.55) 78%,
        rgba(0,0,0,0.70) 100%
      );
    }

    .galeria-video-controls {
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.18);
      opacity: 0.92;
      transition: opacity 200ms ease;
    }

    .galeria-video-wrapper:hover .galeria-video-controls {
      opacity: 1;
    }

    .galeria-video-btn {
      border: none;
      border-radius: 999px;
      padding: 9px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      background: #145214;
      color: #fff;
      transition: transform 150ms ease, filter 150ms ease;
      white-space: nowrap;
    }

    .galeria-video-btn:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    .galeria-video-btn--ghost {
      background: rgba(255,255,255,0.16);
      padding: 9px 12px;
      font-size: 16px;
      font-weight: 600;
    }

    .galeria-progress {
      flex: 1;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.20);
      overflow: hidden;
      cursor: pointer;
    }

    .galeria-progress__fill {
      height: 100%;
      width: 0%;
      background: #d8b44a;
      transition: width 80ms linear;
    }

    .galeria-time {
      font-size: 12px;
      color: rgba(255,255,255,0.92);
      font-weight: 600;
      white-space: nowrap;
    }

    .galeria-video-hint {
      margin: 10px 0 0;
      text-align: center;
      font-size: 13px;
      color: rgba(0,0,0,0.65);
    }

    @media (max-width: 768px) {
      .galeria-video-controls { flex-wrap: wrap; gap: 8px; }
      .galeria-progress { flex-basis: 100%; order: 3; }
    }
  `]
})
export class GaleriaComponent implements AfterViewInit {
  @ViewChild('bodaVideo', { static: true }) bodaVideoRef!: ElementRef<HTMLVideoElement>;

  isPlaying = false;
  isMuted = true;
  duration = 0;
  currentTime = 0;
  progress = 0;

  ngAfterViewInit(): void {
    const v = this.bodaVideoRef.nativeElement;
    // Para evitar bloqueos de autoplay (y porque es tipo hero), lo dejamos muteado.
    v.muted = true;
    this.isMuted = true;
  }

  togglePlay(event?: Event): void {
    if (event) event.stopPropagation();

    const v = this.bodaVideoRef.nativeElement;
    if (v.paused) {
      v.play()
        .then(() => this.isPlaying = true)
        .catch(() => this.isPlaying = false);
    } else {
      v.pause();
      this.isPlaying = false;
    }
  }

  toggleMute(event?: Event): void {
    if (event) event.stopPropagation();

    const v = this.bodaVideoRef.nativeElement;
    v.muted = !v.muted;
    this.isMuted = v.muted;
  }

  onLoadedMetadata(): void {
    const v = this.bodaVideoRef.nativeElement;
    this.duration = v.duration || 0;
  }

  onTimeUpdate(): void {
    const v = this.bodaVideoRef.nativeElement;
    this.currentTime = v.currentTime || 0;

    const d = v.duration || this.duration;
    this.progress = d > 0 ? (this.currentTime / d) * 100 : 0;
  }

  seek(event: MouseEvent): void {
    event.stopPropagation();

    const v = this.bodaVideoRef.nativeElement;
    if (!v.duration) return;

    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);

    v.currentTime = ratio * v.duration;
  }

  formatTime(totalSeconds: number): string {
    if (!totalSeconds || !isFinite(totalSeconds)) return '0:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
