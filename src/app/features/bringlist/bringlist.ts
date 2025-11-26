import { Component, EventEmitter, Output, signal, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BringlistItem } from '../../core/models/event.model';

@Component({
  selector: 'app-bringlist',
  imports: [ReactiveFormsModule],
  templateUrl: './bringlist.html',
  styleUrl: './bringlist.css',
  standalone: true  
})
export class Bringlist implements OnInit {
  @Input() readonly = false;
  @Input() items: BringlistItem[] = [];

  itemInput = new FormControl('');
  bringlist: BringlistItem[] = [];

  @Output() listConfirmed = new EventEmitter<BringlistItem[]>();
  isConfirmed = signal(false);

  ngOnInit(): void {
    if (this.readonly && this.items.length > 0) {
      this.bringlist = [...this.items];
    }
  }

  addNewItem(): void {
    const text = this.itemInput.value?.trim();
    if (!text) return;

    this.bringlist.push({
      item: text,
      checked: false
    }); this.itemInput.setValue('');
  }

  checkItem(index: number): void {
      this.bringlist[index].checked = !this.bringlist[index].checked;
  }

  confirmList(): void {
      this.isConfirmed.set(true);
      this.listConfirmed.emit(this.bringlist);
  }
}

