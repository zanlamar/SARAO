import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../core/models/event.model';
import { Footer } from '../../shared/components/footer/footer';
import { ShareUrlService } from '../../core/services/shareable-url.service';
import { EventService } from '../../core/services/event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shareable-url',
  imports: [CommonModule, Footer],
  templateUrl: './shareable-url.html',
  styleUrl: './shareable-url.css',
  standalone: true
})
export class ShareableUrlComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private shareUrlService = inject(ShareUrlService);
  
  event = signal<Event | null>(null);
  shareUrl = signal<string>('');
  copied = signal<boolean>(false);
  
  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      const eventId = params['id'];
      
      if (eventId) {
        try {
          const loadedEvent = await this.eventService.getEventById(eventId);
          this.event.set(loadedEvent);
          this.shareUrl.set(this.shareUrlService.generateShareUrl(eventId));
        } catch (error) {
          console.error('Error cargando evento:', error);
        }
      }
    });
  }

  async copyToClipboard(): Promise<void> {
    try {
      await this.shareUrlService.copyToClipboard(this.shareUrl());
      this.copied.set(true);
      
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }
}