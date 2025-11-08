import { CommonModule } from '@angular/common';
import { Component, Input, Signal, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
  standalone: true
})
export class EventsList {
  @Input() events$!: Signal<Event[]>;
  @Input() selectedDate$!: Signal<string>;

  @Output() eventClicked = new EventEmitter<Event>();

  onEventClick(event: Event): void {
    this.eventClicked.emit(event);
  }

}
