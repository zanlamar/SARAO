import { Component, Input, Signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EventWithStats } from '../../core/models/event.model';

@Component({
  selector: 'app-table-view',
  imports: [CommonModule, TableModule],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  standalone: true
})
export class TableView {
  @Input() events!: Signal<EventWithStats[]>;
  @Input() sortField!: Signal<string>;
  @Input() sortOrder!: Signal<1 | -1>;
  @Output() sortEvent = new EventEmitter<string>();

}
