import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    event: EventFormDTO | null = null;
    
    constructor(
      private eventService: EventService,
      private router: Router,
    ) {}

    ngOnInit(): void {
      this.event = this.eventService.eventPreview();
    }

    onEdit(): void {
      this.router.navigate(['/create']);
    }

    async onConfirm(): Promise<void> {
      if (!this.event) return;
        try {
          console.log('Event confirmed:', this.event);
          // PENDING: GUARDAR EN BASE DE DATOS
          this.router.navigate(['/calendar-view']);
        } catch (error) {
          console.error('Error confirming event:', error);
        }
  }
}

