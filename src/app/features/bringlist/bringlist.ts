import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BringlistItem } from '../../core/models/event.model';

@Component({
  selector: 'app-bringlist',
  imports: [ReactiveFormsModule],
  templateUrl: './bringlist.html',
  styleUrl: './bringlist.css',
  standalone: true  
})
export class Bringlist {
  itemInput = new FormControl('');
  bringlist: BringlistItem[] = [];
  @Output() listConfirmed = new EventEmitter<BringlistItem[]>();

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
    console.log('Lista confirmada:', this.bringlist);
  }
}
