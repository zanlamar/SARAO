import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableView } from '../table-view/table-view';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';
import { EventWithStats } from '../../core/models/event.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-user-area',
  imports: [CommonModule, TableView, Footer, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './user-area.html',
  styleUrl: './user-area.css',
  standalone: true
})
export class UserArea implements OnInit {
  authService = inject(AuthService);
  eventService = inject(EventService);  
  userEvents$ = signal<EventWithStats[]>([]);

  searchText$ = signal<string>(''); 
  dateFrom$ = signal<Date | null>(null); 
  dateTo$ = signal<Date | null>(null);
  selectedDate$ = signal<Date | null>(null);
  sortField$ = signal<string>('eventDateTime');
  sortOrder$ = signal<1 | -1>(1); 

  filteredEvents$ = computed((): EventWithStats[] => {
    let events = [...this.userEvents$()];
    const search = this.searchText$().toLowerCase();
    
    if (search) {
      events = events.filter(event =>
        event.title?.toLowerCase().includes(search) || 
        event.description?.toLowerCase().includes(search) ||
        event.location?.alias?.toLowerCase().includes(search) 
      );
    }
    
    const selectedDate = this.selectedDate$();
    if (selectedDate) {
      events = events.filter(event => {
        const eventDate = new Date(event.eventDateTime);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      const from = this.dateFrom$();
      const to = this.dateTo$();
      if (from || to) {
        events = events.filter(event => {
          const eventDate = new Date(event.eventDateTime);
          if (from && eventDate < from) return false;
          if (to && eventDate > to) return false;
          return true;
        });
      }
    }

    const field = this.sortField$();
    const order = this.sortOrder$();

    events.sort((a, b) => {
      const valueA = (a as any)[field];
      const valueB = (b as any)[field];
      if (valueA < valueB) return -1 * order;
      if (valueA > valueB) return 1 * order;
      return 0;
    });
    return events;
  });
  
  async ngOnInit(): Promise<void> {
    const events = await this.eventService.getLoggedUserEventsWithStats();
    this.userEvents$.set(events);
  }

  onSearch(text: string): void {
    this.searchText$.set(text.trim());
  }

  onSort(field: string): void {
    console.log('Sorting por:', field); 

    if (this.sortField$() === field) {
      this.sortOrder$.set(this.sortOrder$() === 1 ? -1 : 1);
    } else {
      this.sortField$.set(field);
      this.sortOrder$.set(1);
    }
  }

  onDateChange(dateString: string): void {
    if (dateString) {
      this.selectedDate$.set(new Date(dateString));
      this.dateFrom$.set(null);
      this.dateTo$.set(null);
    } else {
      this.selectedDate$.set(null);
    }
  }

  onThisMonth(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.selectedDate$.set(null);
    this.dateFrom$.set(firstDay);
    this.dateTo$.set(lastDay);
  }

  onNextMonth(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    this.selectedDate$.set(null);
    this.dateFrom$.set(firstDay);
    this.dateTo$.set(lastDay);
  }

  onClear(searchInput: HTMLInputElement, dateInput: HTMLInputElement): void {
    this.selectedDate$.set(null);
    this.dateFrom$.set(null);
    this.dateTo$.set(null);
    this.searchText$.set('');
    searchInput.value = '';
    dateInput.value = '';

    this.ngOnInit;
  }

}