import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
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
