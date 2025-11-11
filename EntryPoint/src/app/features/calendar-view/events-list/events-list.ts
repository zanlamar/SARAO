import { CommonModule } from '@angular/common';
import { Component, Input, Signal, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../core/models/event.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
  standalone: true
})
export class EventsList {
  router = inject(Router);
  @Input() events$!: Signal<Event[]>;
  @Input() selectedDate$!: Signal<string>;

  @Output() eventClicked = new EventEmitter<Event>();


  onEventClick(event: Event): void {
    this.eventClicked.emit(event);
  }

  onEditEvent(event: Event): void {
    this.eventClicked.emit(event);
  }

  onDelete(event: Event): void {
    this.eventClicked.emit(event);
  }

  onSee(event: Event): void {
    this.eventClicked.emit(event);
    this.router.navigate(['/event-preview', event.id]);
  }
}
