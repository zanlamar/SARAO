import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { EventFormDTO } from '../../core/models/event.model';
import { Footer } from '../../shared/components/footer/footer';

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

  event = signal<EventFormDTO | null>(null);
  isCreating = signal<boolean>(false);
  
  constructor(
  ) {}

  ngOnInit(): void {
      this.route.params.subscribe(params => {
      const eventId = params['id'];
      console.log('🔍 Route params:', { eventId });
      
      if (eventId) {
        this.loadEventFromDatabase(eventId);
        this.isCreating.set(false);
      } else {
        this.event.set(this.eventService.eventPreview());
        this.isCreating.set(true);
        console.log('✅ isCreating = true');
      }
    });
  }

  private async loadEventFromDatabase(eventId: string): Promise<void> {
    try {
      const loadedEvent = await this.eventService.getEventById(eventId);
      this.event.set(loadedEvent);
      console.log('Evento cargado desde BD:', loadedEvent);
    } catch (error) {
      console.error('Error loading event from database:', error);
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
}



