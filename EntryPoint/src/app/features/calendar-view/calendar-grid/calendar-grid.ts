import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { CalendarDay } from '../../../core/models/calendar.model';
import { CalendarService } from '../../../core/services/calendar.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-calendar-grid',
  imports: [CommonModule],
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.css',
  standalone: true,
})
export class CalendarGrid {
  @Input() calendarDays$!: Signal<CalendarDay[]>;
  @Input() selectedDate$!: Signal<string>;
  @Input() currentMonth: number = 0;
  @Input() currentYear: number = new Date().getFullYear();
  @Input() userEvents$!: Signal<Event[]>;

  @Output() daySelected = new EventEmitter<string>();
  @Output() nextMonthClicked = new EventEmitter<void>();
  @Output() previousMonthClicked = new EventEmitter<void>();

  constructor(
    public calendarService: CalendarService) {}

    onDayClick(day: CalendarDay): void {
      if (!day.isCurrentMonth) {
        day.month < this.currentMonth ? this.previousMonthClicked.emit() : this.nextMonthClicked.emit();
      }
      this.daySelected.emit(day.dateString);
    }

    getEventsForDay(dateString: string, allEvents: Event[]): Event[] {
      return allEvents.filter(event => {
        const eventDateString = this.calendarService.formatDateToString(event.eventDate);
        return eventDateString === dateString;
      });
    }
}
