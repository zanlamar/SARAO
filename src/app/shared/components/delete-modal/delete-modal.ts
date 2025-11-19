import { Component, Input, Output, EventEmitter, inject , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../core/models/event.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-delete-modal',
  imports: [CommonModule, ConfirmDialog, ToastModule],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
  standalone: true,
  providers: [ConfirmationService, MessageService]
})
export class DeleteModal implements OnInit {
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService) 

  @Input() event!: Event;
  @Output() onConfirmDelete = new EventEmitter<Event>();

  ngOnInit(): void {
    this.confirm();
  }

  confirm(): void {
    this.confirmationService.confirm({
      message: `Delete "${this.event.title}"?`,
      header: 'Watch out!',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Deleted', 
          detail: 'Event removed' 
        });
        this.onConfirmDelete.emit(this.event); 
      },
      reject: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Rejected', 
          detail: 'You have rejected' 
        });
      },
    });
  }
}
