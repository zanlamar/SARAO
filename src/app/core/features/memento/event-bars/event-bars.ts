import { Component, OnInit, inject, signal, computed, effect, ViewChild, ElementRef, input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { EventWithStats } from '../../../../core/models/event.model';

Chart.register(...registerables);

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

@Component({
  selector: 'app-event-bars',
  imports: [CommonModule],
  templateUrl: './event-bars.html',
  styleUrl: './event-bars.css',
  standalone: true
})
export class EventBars implements OnInit, AfterViewInit, OnDestroy {
  events = input.required<EventWithStats[]>();
  
  @ViewChild('barCanvas', { static: false }) barCanvas!: ElementRef<HTMLCanvasElement>;
  
  selectedSeason = signal<Season>('spring');
  
  private chart?: Chart;

  monthlyStats = computed(() => {
    const allEvents = this.events();
    const season = this.selectedSeason();
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const seasonMonths: Record<Season, { months: number[], labels: string[] }> = {
      spring: {
        months: [2, 3, 4],
        labels: ['March', 'April', 'May']
      },
      summer: {
        months: [5, 6, 7], 
        labels: ['June', 'July', 'August']
      },
      autumn: {
        months: [8, 9, 10], 
        labels: ['September', 'October', 'November']
      },
      winter: {
        months: [11, 0, 1], 
        labels: ['December', 'January', 'February']
      }
    };

    const { months, labels } = seasonMonths[season];
    const counts = months.map(() => 0);

    allEvents.forEach(event => {
      const eventDate = new Date(event.eventDateTime);
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      
      if (season === 'winter') {
        if (eventMonth === 11 && eventYear === currentYear) {
          counts[0]++; 
        } else if ((eventMonth === 0 || eventMonth === 1) && 
          (eventYear === currentYear || eventYear === currentYear + 1)) {
          counts[eventMonth === 0 ? 1 : 2]++; 
        }
      } else {
        const firstMonth = months[0];
        const monthIndex = eventMonth - firstMonth;
        if (monthIndex >= 0 && monthIndex < 3 && eventYear === currentYear) {
          counts[monthIndex]++;
        }
      }
    });

    return { labels, counts };
  });

  constructor() {
    effect(() => {
      const stats = this.monthlyStats();
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
    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const stats = this.monthlyStats();

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: stats.labels,
        datasets: [{
          label: 'Events Count',
          data: stats.counts,
          backgroundColor: '#7489ff',
          borderWidth: 2,
          barThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 15,
            ticks: {
              stepSize: 1,
              font: {
                family: "'Nunito Sans', sans-serif",
                size: 12
              },
              color: '#6b7280'
            },
            grid: {
              color: '#e5e7eb'
            }
          },
          x: {
            ticks: {
              font: {
                family: "'Nunito Sans', sans-serif",
                size: 12
              },
              color: '#6b7280'
            },
            grid: {
              display: false 
            }
          }
        },
        plugins: {
          legend: {
            display: false 
          },
          tooltip: {
            backgroundColor: '#010101',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `${value} event${value !== 1 ? 's' : ''}`;
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

    const stats = this.monthlyStats();
    
    this.chart.data.labels = stats.labels;
    this.chart.data.datasets[0].data = stats.counts;
    
    this.chart.update();
  }

  selectSeason(season: Season): void {
    this.selectedSeason.set(season);
  }

  isSelected(season: Season): boolean {
    return this.selectedSeason() === season;
  }

  totalEvents = computed(() => {
    return this.monthlyStats().counts.reduce((sum, count) => sum + count, 0);
  });
}
