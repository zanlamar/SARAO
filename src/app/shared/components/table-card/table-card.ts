import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { EventWithStats } from '../../../core/models/event.model';

@Component({
  selector: 'app-table-card',
  imports: [CommonModule, CardModule, TagModule, ButtonModule],
  templateUrl: './table-card.html',
  styleUrl: './table-card.css',
  standalone: true
})
export class TableCard {
  @Input() event!: EventWithStats;
  @Output() moreInfo = new EventEmitter<string>();

  onMoreInfo() {
    this.moreInfo.emit(this.event.id);
  }

}
