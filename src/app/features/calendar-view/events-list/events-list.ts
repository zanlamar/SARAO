import { CommonModule } from '@angular/common';
import { Component, Input, Signal, Output, EventEmitter, inject, signal } from '@angular/core';
import { Event } from '../../../core/models/event.model';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { DeleteModal } from "../../../shared/components/delete-modal/delete-modal";

@Component({
  selector: 'app-events-list',
  imports: [CommonModule, DeleteModal],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
  standalone: true,
})
export class EventsList {
  router = inject(Router);
  eventService = inject(EventService);
  eventToDelete: Event | null = null;
  
  @Input() events$!: Signal<Event[]>;
  @Input() selectedDate$!: Signal<string>;
  @Output() eventClicked = new EventEmitter<Event>();
  @Output() onEventDeleted = new EventEmitter<void>();
  @Input() activeFilter!: Signal<'hosting' | 'upcoming' | 'all'>;


  onEventClick(event: Event): void {
    this.eventClicked.emit(event);
  }

  onEditEvent(event: Event): void {
    this.router.navigate(['/create'], { queryParams: { id: event.id } });
  }

  onDeleteClick(event: Event): void {
    this.eventToDelete = event;
  }

  onConfirmDelete(event: Event): void {
    this.eventService.deleteEvent(event.id);
    this.eventToDelete = null;
    this.onEventDeleted.emit();
  }

  onSee(event: Event): void {
    this.eventClicked.emit(event);
    this.router.navigate(['/event-preview', event.id]);
  }

  onShareEvent(eventId: string): void {
    this.router.navigate(['/shareable-url', eventId]);
  }

  isHostEvent(event: Event): boolean {
    return !(event as any).isGuest;
  }
}
