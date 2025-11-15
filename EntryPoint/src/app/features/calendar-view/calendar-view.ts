import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';
import { Footer } from "../../shared/components/footer/footer";
import { CalendarDay } from '../../core/models/calendar.model';
import { EventsList } from './events-list/events-list';
import { CalendarService } from '../../core/services/calendar.service';
import { CalendarGrid } from './calendar-grid/calendar-grid';

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, Footer, EventsList, CalendarGrid],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  standalone: true,
})

export class CalendarView implements OnInit {

  calendarDays$ = signal<CalendarDay[]>([]);
  userEvents$ = signal<Event[]>([]);
  selectedDate$ = signal<string>('');
  selectedDateEvents$ = signal<Event[]>([]);
  currentMonth$ = signal<number>(new Date().getMonth());
  currentYear$ = signal<number>(new Date().getFullYear());

  constructor(
    private eventService: EventService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.loadUserEvents();
    this.generateCalendar();
  }


  private generateCalendar(): void {
    const days = this.calendarService.generateCalendarDays(
      this.currentMonth$(), this.currentYear$()
    );
    this.calendarDays$.set(days);
  }

  async loadUserEvents(): Promise<void> { 
    console.log('🔄 loadUserEvents ejecutándose...'); 
    const events = await this.eventService.getLoggedUserEvents();
    console.log('📊 Eventos cargados:', events.length);
    this.userEvents$.set(events);
    
    if (this.selectedDate$()) {
    console.log('📅 Actualizando día seleccionado:', this.selectedDate$());
    this.selectDay(this.selectedDate$());
    }
  }

  selectDay(dateString: string): void {
    this.selectedDate$.set(dateString);

    const filtered = this.userEvents$().filter(event => {
      const eventDateString = this.calendarService.formatDateToString(event.eventDateTime);
      return eventDateString === dateString;
    });
    this.selectedDateEvents$.set(filtered);
  }

  getTodayDateString(): string {
    const today = new Date();
    return this.calendarService.formatDateToString(today);
  }
    
  onDaySelected(dateString: string): void {
    this.selectDay(dateString);
  }

  onPreviousMonth(): void {
    const { month, year } = this.calendarService.previousMonth(
      this.currentMonth$(), this.currentYear$(),
    );
    this.currentMonth$.set(month);
    this.currentYear$.set(year);
    this.generateCalendar();
  }

  onNextMonth(): void {
    const { month, year } = this.calendarService.nextMonth(
      this.currentMonth$(), this.currentYear$());
    this.currentMonth$.set(month);
    this.currentYear$.set(year);
    this.generateCalendar();
  }

  onEventClicked(event: Event): void {
    console.log('Event clicked:', event);
  }


}
