import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { EventWithStats } from '../../core/models/event.model';
import { EventBars } from '../event-bars/event-bars';
import { ChartView } from '../chart-view/chart-view';

@Component({
  selector: 'app-memento',
  imports: [
    CommonModule,
    EventBars,
    ChartView
  ],
  templateUrl: './memento.html',
  styleUrl: './memento.css',
  standalone: true,
})
export class Memento implements OnInit {
  private eventService = inject(EventService);
  authService = inject(AuthService);
  
  userEvents = signal<EventWithStats[]>([]);
  isLoading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    try {
      const events = await this.eventService.getLoggedUserEventsWithStats();
      this.userEvents.set(events);
      console.log('✅ Eventos cargados en memento:', events.length);
    } catch (error) {
      console.error('❌ Error cargando eventos en memento:', error);
      this.userEvents.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
