import { Component, OnInit, inject, signal, computed, effect, ViewChild, ElementRef, input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { EventWithStats } from '../../core/models/event.model';

Chart.register(...registerables);

type Period = 'thisMonth' | 'nextMonth' | 'spring' | 'summer' | 'autumn' | 'winter';

@Component({
  selector: 'app-chart-view',
  imports: [CommonModule],
  templateUrl: './chart-view.html',
  styleUrl: './chart-view.css',
  standalone: true
})
export class ChartView implements OnInit, AfterViewInit, OnDestroy {

  events = input.required<EventWithStats[]>();
  
  @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  
  selectedPeriod = signal<Period>('thisMonth');
  
  private chart?: Chart;

  filteredEvents = computed(() => {
    const allEvents = this.events();
    const period = this.selectedPeriod();
    const now = new Date();
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.eventDateTime);
      
      switch (period) {
        case 'thisMonth':
          return eventDate.getMonth() === now.getMonth() && 
            eventDate.getFullYear() === now.getFullYear();
        
        case 'nextMonth':
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          return eventDate.getMonth() === nextMonth.getMonth() && 
            eventDate.getFullYear() === nextMonth.getFullYear();
        
        case 'spring':
          return [2, 3, 4].includes(eventDate.getMonth()) && 
            eventDate.getFullYear() === now.getFullYear();
        
        case 'summer':
          return [5, 6, 7].includes(eventDate.getMonth()) && 
            eventDate.getFullYear() === now.getFullYear();
        
        case 'autumn':
          return [8, 9, 10].includes(eventDate.getMonth()) && 
            eventDate.getFullYear() === now.getFullYear();
        
        case 'winter':
          const month = eventDate.getMonth();
          const year = eventDate.getFullYear();
          if (month === 11) {
            return year === now.getFullYear();
          } else if (month === 0 || month === 1) {
            return year === now.getFullYear() || year === now.getFullYear() + 1;
          }
          return false;
        
        default:
          return true;
      }
    });
  });

  stats = computed(() => {
    const events = this.filteredEvents();
    
    const confirmed = events.reduce((sum, event) => sum + event.confirmed, 0);
    const notComing = events.reduce((sum, event) => sum + event.notComing, 0);
    const undecided = events.reduce((sum, event) => sum + event.undecided, 0);
    const pending = events.reduce((sum, event) => sum + event.pending, 0);
    const total = confirmed + notComing + undecided + pending;

    return { confirmed, notComing, undecided, pending, total };
  });

  constructor() {
    effect(() => {
      const currentStats = this.stats();
        if (this.chart) {
          this.updateChart();
        }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    const ctx = this.doughnutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const currentStats = this.stats();

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Not Coming', 'Undecided', 'Pending'],
        datasets: [{
          data: [
            currentStats.confirmed, 
            currentStats.notComing, 
            currentStats.undecided, 
            currentStats.pending
          ],
          backgroundColor: [
            '#7489ff',
            '#ff9673',
            '#ffd13a',
            '#e8f0e9'
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                family: "'Nunito Sans', sans-serif",
                size: 12
              },
              color: '#010101'
            }
          },
          tooltip: {
            backgroundColor: '#010101',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = currentStats.total || 1;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    const currentStats = this.stats();
    
    this.chart.data.datasets[0].data = [
      currentStats.confirmed,
      currentStats.notComing,
      currentStats.undecided,
      currentStats.pending
    ];
    this.chart.update();
  }

  selectPeriod(period: Period): void {
    this.selectedPeriod.set(period);
  }

  isSelected(period: Period): boolean {
    return this.selectedPeriod() === period;
  }
}