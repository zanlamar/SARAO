import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { EventFormDTO, Event } from '../../core/models/event.model';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-event-preview',
  imports: [CommonModule, Footer],
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
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      // console.log('🔍 Route params:', { eventId });
      // console.log('🔍 isCreating ANTES:', this.isCreating()); 
      
      if (eventId) {
        this.loadEventFromDatabase(eventId);
        this.isCreating.set(false);

        const user = this.authService.currentUser();

          if (user) {
            console.log('✅ Hay usuario, creando invitation...');
            this.eventService.saveInvitation(
              eventId, 
              user.uid, 
              user.email || ''
            ).catch((error: any) => {
              console.error('❌ Error al guardar invitation:', error);
            });
          }
      } else {
        const previewData = this.eventService.eventPreview();
        // console.log('📋 eventPreview() data:', JSON.stringify(previewData, null, 2)); 
        this.event.set(previewData);
        this.isCreating.set(true);
        // console.log('✅ Evento en signal después de set:', JSON.stringify(this.event(), null, 2)); 
        // console.log('✅ isCreating = true');
      }
    });
  }

  private async loadEventFromDatabase(eventId: string): Promise<void> {
    try {
      const loadedEvent = await this.eventService.getEventById(eventId);
        // console.log('📸 Evento cargado:', loadedEvent);
        // console.log('📸 imageUrl específicamente:', loadedEvent.imageUrl);
        // console.log('Evento cargado desde BD:',  this.event());

      this.event.set(loadedEvent);

      // console.log('✅ Signal actualizado a:', this.event());
      // console.log('✅ imageUrl en signal:', this.event()?.imageUrl);
      
    } catch (error) {
      // console.error('❌ Error loading event from database:', error);
      // console.error('❌ Error completo:', JSON.stringify(error, null, 2));
      this.router.navigate(['/calendar-view']);
    }
  }

  onEdit(): void {
    if (this.isCreating()) {
      this.router.navigate(['/create']);
    } else {
      console.log('Edición no disponible aún');
    }
  }
  
  async onConfirm(): Promise<void> {
    console.log('🎯 onConfirm iniciado');

    if (!this.isCreating()) {
    console.log('❌ No estamos en modo creación');
    return; 
    }

    try {
      console.log('📝 Llamando createEvent...');
      const savedEvent = await this.eventService.createEvent(
        this.event() as EventFormDTO,
        null
      );
      console.log('✅ Evento guardado:', savedEvent);
      console.log('🔗 Navegando a:', `/shareable-url/${savedEvent.id}`);

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
    console.log('🎤 RSVP respondiendo:', response);

    const user = this.authService.currentUser();
    console.log('👤 User details:', user);  // Ver qué tiene
    console.log('👤 User ID:', user?.id);
    if (!user) {
      console.error('❌ No hay usuario autenticado');
      return;
    }

    const currentEvent = this.event() as Event;
    if (!currentEvent?.id) {
      console.error('❌ No hay evento');
      return;
    };

    try {
      await this.eventService.updateRSVP(
        currentEvent.id,
        user.uid,
        response
      );
      
      this.rsvpResponse.set(response);
      console.log('✅ RSVP guardado:', response);

    } catch (error) {
      console.error('❌ Error al guardar RSVP:', error);
    }
  }

    
}



