import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';
import { Footer } from "../../shared/components/footer/footer";

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  dateString: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  dayOfWeek: number;
}

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, Footer],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  standalone: true,
})

export class CalendarView implements OnInit {

  calendarDays: CalendarDay[] = [];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  userEvents: Event[] = [];
  selectedDateEvents: Event[] = [];
  selectedDate: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.generateCalendarDays();
    this.loadUserEvents();
  }

  getTodayDateString(): string {
    const today = new Date();
    return this.formatDateToString(today);
  }

  selectDay(dateString: string): void {
    this.selectedDate = dateString;
    this.selectedDateEvents = this.userEvents.filter( event => {
      const eventDateString = this.formatDateToString(event.eventDate);
      return eventDateString === dateString;
    });
  }


  private generateCalendarDays(): void {
    this.calendarDays = [];

    const currentMonthDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstWeekdayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const firstWeekdayLundayFirst = (firstWeekdayOfMonth - 1 + 7) % 7;
    const previousMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
  
    for (let i = firstWeekdayLundayFirst - 1; i >= 0; i--) {
      const day = previousMonthDays - i;
      const calendarDay = this.createCalendarDay(day, this.currentMonth - 1, this.currentYear, false);
      this.calendarDays.push(calendarDay);
    }

    for (let day = 1; day <= currentMonthDays; day++) {
      const calendarDay = this.createCalendarDay(day, this.currentMonth, this.currentYear, true);
      this.calendarDays.push(calendarDay);
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - this.calendarDays.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      const calendarDay = this.createCalendarDay(day, this.currentMonth + 1, this.currentYear, false);
      this.calendarDays.push(calendarDay);
    }
  }

  private createCalendarDay(day: number, month: number, year: number, isCurrentMonth: boolean): CalendarDay {
    const date = new Date(year, month, day);
    const dateString = this.formatDateToString(date);
    const isToday = this.isToday(date);
    const dayOfWeek = (date.getDay() - 1 + 7) % 7; 
    return {
      day,
      month: date.getMonth(),     
      year: date.getFullYear(),   
      dateString,
      isToday,
      isCurrentMonth,
      dayOfWeek
    };
  }


  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  private loadUserEvents(): void {
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
      this.userEvents = events;
      this.selectDay(this.getTodayDateString());
    }
  );
  }

    previousMonth(): void {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.generateCalendarDays();
    }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
  }

  onDayClick(calendarDay: CalendarDay): void {
    this.selectDay(calendarDay.dateString);
  }

  getEventsForDay(dateString: string): Event[] {
    return this.userEvents.filter(event => {
      const eventDateString = this.formatDateToString(event.eventDate);
      return eventDateString === dateString;
    });
  }

  getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

}
