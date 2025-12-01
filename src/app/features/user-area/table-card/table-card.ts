import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { EventWithStats, EmailAttendeesByStatus } from '../../../core/models/event.model';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-table-card',
  imports: [CommonModule, CardModule, TagModule, ButtonModule, DialogModule],
  templateUrl: './table-card.html',
  styleUrl: './table-card.css',
  standalone: true
})
export class TableCard {
  @Input() event!: EventWithStats;
  @Input() attendees?: EmailAttendeesByStatus;

  @Output() moreInfo = new EventEmitter<string>();
  showModal = signal<boolean>(false);

  onMoreInfo() {
    this.showModal.set(true);
    this.moreInfo.emit(this.event.id);
  }

  closeModal() {
    this.showModal.set(false);
  }

}
