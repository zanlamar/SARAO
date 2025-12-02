import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { CalendarDay } from '../../../../core/models/calendar.model';
import { CalendarService } from '../../../../core/services/calendar.service';
import { Event } from '../../../../core/models/event.model';
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
  @Input() currentMonth!: Signal<number>;
  @Input() currentYear!: Signal<number>;
  @Input() userEvents$!: Signal<Event[]>;
  @Output() daySelected = new EventEmitter<string>();
  @Output() nextMonthClicked = new EventEmitter<void>();
  @Output() previousMonthClicked = new EventEmitter<void>();
  
  constructor(
    public calendarService: CalendarService) {}

    onDayClick(day: CalendarDay): void {
      const currentMonth = this.currentMonth();
      const clickedMonth = day.month;

      if (!day.isCurrentMonth) {
        const isPrevious =
        clickedMonth === (currentMonth + 11) % 12; 
        const isNext =
        clickedMonth === (currentMonth + 1) % 12; 

        if (isPrevious) {
          this.previousMonthClicked.emit();
        } else if (isNext) {
          this.nextMonthClicked.emit();
        }
      }
      this.daySelected.emit(day.dateString);
    }

    getEventsForDay(dateString: string, allEvents: Event[]): Event[] {
      return allEvents.filter(event => {
        const eventDateString = this.calendarService.formatDateToString(event.eventDateTime);
        return eventDateString === dateString;
      });
    }
}

