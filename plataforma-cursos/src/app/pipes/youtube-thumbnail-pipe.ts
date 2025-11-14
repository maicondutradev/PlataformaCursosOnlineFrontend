import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'youtubeThumbnail',
  standalone: true
})
export class YoutubeThumbnailPipe implements PipeTransform {

  private sanitizer = inject(DomSanitizer);

  transform(videoUrl: string): SafeResourceUrl | string {
    if (!videoUrl) {
      return 'assets/placeholder.png';
    }

    let videoId: string | null = null;

    try {
      const url = new URL(videoUrl);

      if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
        videoId = url.searchParams.get('v');
      }
      else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      }
    } catch (e) {
      console.error('URL inválida para o pipe do YouTube:', videoUrl);
      return 'assets/placeholder.png';
    }

    if (!videoId) {
      return 'assets/placeholder.png';
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(thumbnailUrl);
  }
}
