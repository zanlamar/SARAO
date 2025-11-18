import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed} from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';
import { Footer } from "../../shared/components/footer/footer";
import { CalendarDay } from '../../core/models/calendar.model';
import { EventsList } from './events-list/events-list';
import { CalendarService } from '../../core/services/calendar.service';
import { CalendarGrid } from './calendar-grid/calendar-grid';
import { AuthService } from '../../core/services/auth.service';

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
  activeFilter = signal<'hosting' | 'upcoming' | 'all'>('all');
  filteredEvents$ = signal<Event[]>([]);

    displayedEvents$ = computed(() => {
      if (this.selectedDate$()) {
      return this.selectedDateEvents$();
    }
    return this.filteredEvents$();
    });


  constructor(
    private eventService: EventService,
    private calendarService: CalendarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserEvents();
    this.generateCalendar();
    this.updateFilteredEvents();
  }


  private generateCalendar(): void {
    const days = this.calendarService.generateCalendarDays(
      this.currentMonth$(), this.currentYear$()
    );
    this.calendarDays$.set(days);
  }

  async loadUserEvents(): Promise<void> { 
    console.log('🔄 loadUserEvents ejecutándose...'); 

    const createdEvents = await this.eventService.getLoggedUserEvents();
    console.log('✅ getLoggedUserEvents OK:', createdEvents.length);
    const guestEvents = await this.eventService.getGuestEvents();
    console.log('✅ getGuestEvents OK:', guestEvents.length); 
    const allEvents = [...createdEvents, ...guestEvents];
    allEvents.sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());

      
      console.log('📊 Eventos creados:', createdEvents.length);
      console.log('📊 Eventos como guest:', guestEvents.length);
      
      this.userEvents$.set(allEvents);
      this.updateFilteredEvents(); 
      
    if (this.selectedDate$()) {
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

  setFilter(filter: 'hosting' | 'upcoming' | 'all'): void {
  this.selectedDate$.set('');
  this.selectedDateEvents$.set([]);
  
  this.activeFilter.set(filter);
  this.updateFilteredEvents();
}

  private updateFilteredEvents(): void {
    const user = this.authService.currentUser();
    const allEvents = this.userEvents$();

    console.log('🔍 updateFilteredEvents');
    console.log('📊 Total eventos:', allEvents.length);
    console.log('📊 Eventos con isGuest:', allEvents.filter(e => (e as any).isGuest).length);
    console.log('📊 Eventos sin isGuest:', allEvents.filter(e => !(e as any).isGuest).length);
    console.log('🎯 Filtro activo:', this.activeFilter());
    
    if (this.activeFilter() === 'hosting') {
      const filtered = allEvents.filter(e => !(e as any).isGuest);
      console.log('🏠 HOSTING filtrando, resultado:', filtered.length);
      this.filteredEvents$.set(filtered);
    } else if (this.activeFilter() === 'upcoming') {
      const filtered = allEvents.filter(e => (e as any).isGuest);
      console.log('📅 UPCOMING filtrando, resultado:', filtered.length);
      this.filteredEvents$.set(filtered);
    } else {
      console.log('✨ ALL mostrando todos');
      this.filteredEvents$.set(allEvents);
    }
  }
}

