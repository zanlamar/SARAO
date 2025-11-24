import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { EventFormDTO, Event } from '../../core/models/event.model';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService } from '../../core/services/auth.service';
import { PreviewMap } from '../../shared/components/preview-map/preview-map';

@Component({
  selector: 'app-event-preview',
  imports: [CommonModule, Footer, PreviewMap],
  templateUrl: './event-preview.html',
  styleUrl: './event-preview.css',
  standalone: true,
})
export class EventPreview implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  event = signal<EventFormDTO | Event | null>(null);
  isCreating = signal<boolean>(false);
  rsvpResponse = signal<'yes' | 'maybe' | 'no' | null>(null);
  constructor(
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      const eventId = params['id'];
      
      if (eventId) {
        this.loadEventFromDatabase(eventId);
        this.isCreating.set(false);

        const user = this.authService.currentUser();

          if (user) {
            try {
              await this.eventService.saveInvitation(
                eventId, 
                user.uid, 
                user.email || ''
              );
            } catch (error: any) {
              console.error('❌ Error al guardar invitation:', error);
            }
          }
      } else {
        const previewData = this.eventService.eventPreview();
        this.event.set(previewData);
        this.isCreating.set(true);
      }
    });
  }

  private async loadEventFromDatabase(eventId: string): Promise<void> {
    try {
      const loadedEvent = await this.eventService.getEventById(eventId);
      this.event.set(loadedEvent);
      
    } catch (error) {
      this.router.navigate(['/calendar-view']);
    }
  }

  onEdit(): void {
    if (this.isCreating()) {
      this.router.navigate(['/create']);
    } else {
    }
  }
  
  async onConfirm(): Promise<void> {

    if (!this.isCreating()) {
    return; 
    }

    try {
      const savedEvent = await this.eventService.createEvent(
        this.event() as EventFormDTO,
        null
      );

      this.eventService.eventPreview.set(null);
      this.router.navigate(['/shareable-url', savedEvent.id]);
    } catch (error) {
      console.error('❌ Error al confirmar el evento:', error);
    }
  }

  onBack(): void {
    this.router.navigate(['/calendar-view']);
  }

  async onRSVP(response: 'yes' | 'maybe' | 'no'): Promise<void> {
  const user = this.authService.currentUser();
  const currentEvent = this.event() as Event;
  

  if (!user || !currentEvent?.id) {
    console.error('❌ Falta usuario o evento');
    return;
  }

  try {
    await this.eventService.saveInvitation(
      currentEvent.id,
      user.uid,
      user.email || ''
    );

    await this.eventService.updateRSVP(
      currentEvent.id,
      user.uid,
      response
    );

    this.rsvpResponse.set(response);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
    
}



