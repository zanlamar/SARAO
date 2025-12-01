import { Component, Input, Signal, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EventWithStats, EmailAttendeesByStatus } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { TableCard } from '../table-card/table-card';

@Component({
  selector: 'app-table-view',
  imports: [CommonModule, TableModule, TableCard],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  standalone: true
})

export class TableView {
  
  @Input() events!: Signal<EventWithStats[]>;
  @Input() sortField!: Signal<string>;
  @Input() sortOrder!: Signal<1 | -1>;
  @Output() sortEvent = new EventEmitter<string>();
  
  expandedEventId = signal<string | null>(null);
  attendeesByEvent = signal<Map<string, EmailAttendeesByStatus>>(new Map());
  
  constructor( private eventService: EventService) {}

  toggleEventDetails(eventId: string): void {
    if (this.expandedEventId() === eventId) {
      this.expandedEventId.set(null);
    } else {
      this.expandedEventId.set(eventId);
      this.loadAttendees(eventId);
    }
  }
  
  openMobileModal(eventId: string): void {
    this.toggleEventDetails(eventId);
  }

  private async loadAttendees(eventId: string): Promise<void> {
    try {
      const attendees = await this.eventService.getAttendeesByEvent(eventId);
      const map = new Map(this.attendeesByEvent());
      map.set(eventId, attendees);
      this.attendeesByEvent.set(map);
    } catch (error) {
      console.error('Error cargando asistentes:', error);
    }
  }
}
