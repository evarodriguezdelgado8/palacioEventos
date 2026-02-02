import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';

@Component({
    selector: 'app-background-video',
    templateUrl: './background-video.component.html',
    styleUrls: ['./background-video.component.scss']
})
export class BackgroundVideoComponent implements AfterViewInit, OnChanges {
    @Input() videoMp4: string = '';
    @Input() videoWebm: string = '';
    @Input() showControls: boolean = true;

    @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

    isPlaying = true;
    isMuted = true;
    progress = 0;

    ngAfterViewInit() {
        this.reloadVideo();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes['videoMp4'] || changes['videoWebm']) && !changes['videoMp4']?.firstChange) {
            this.reloadVideo();
        }
    }

    @HostListener('window:click', ['$event'])
    @HostListener('window:touchstart', ['$event'])
    handleInteraction() {
        // If the video is paused but we want it playing, try again on any user interaction
        const video = this.bgVideo?.nativeElement;
        if (video && video.paused && this.isPlaying) {
            video.play().catch(() => { });
        }
    }

    private reloadVideo() {
        if (this.bgVideo) {
            const video = this.bgVideo.nativeElement;

            // Reset properties
            video.muted = true;
            video.defaultMuted = true;
            video.autoplay = true;
            video.loop = true;

            // Force attributes for some browsers
            video.setAttribute('muted', 'muted');
            video.setAttribute('autoplay', 'autoplay');
            video.setAttribute('playsinline', 'true');
            video.setAttribute('loop', 'loop'); // Explicit loop attribute

            video.load();

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    console.log('Video playing successfully');
                }).catch(err => {
                    console.warn('Playback failed, waiting for user interaction:', err);
                    this.isPlaying = false;
                });
            }
        }
    }

    onVideoEnded() {
        console.log('Video ended. Forcing replay...');
        if (this.bgVideo) {
            const video = this.bgVideo.nativeElement;
            video.currentTime = 0;
            video.play().catch(e => console.error('Loop replay failed', e));
            this.isPlaying = true;
        }
    }

    togglePlay(video: HTMLVideoElement): void {
        if (video.paused) {
            video.play().then(() => this.isPlaying = true);
        } else {
            video.pause();
            this.isPlaying = false;
        }
    }

    toggleMute(video: HTMLVideoElement): void {
        video.muted = !video.muted;
        this.isMuted = video.muted;
    }

    updateProgress(video: HTMLVideoElement): void {
        if (video.duration) {
            this.progress = (video.currentTime / video.duration) * 100;
        }
    }
}
