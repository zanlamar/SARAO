import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Footer } from '../../shared/components/footer/footer'; 
import { AuthService } from '../../core/services/auth.service'; 
import { EventService } from '../../core/services/event.service';   
import { StorageService } from '../../core/services/storage.service';
import { EventFormDTO, GeocodingResult, BringlistItem } from '../../core/models/event.model';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { LocationSearch  } from '../../shared/components/location-search/location-search';
import { Bringlist } from '../../features/bringlist/bringlist';

@Component({
  selector: 'app-event-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatStepperModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatButtonModule, 
    MatRadioModule, 
    MatTimepickerModule, 
    Footer, 
    FormsModule, 
    DatePicker,
    LocationSearch,
    Bringlist
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  standalone: true
})
export class EventForm implements OnInit {
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;
  step4FormGroup: FormGroup;
  step5FormGroup: FormGroup;

  selectedFileName = '';
  isEditMode = signal(false);
  currentEventId = signal<string | null>(null);
  isStep3Active = signal(false);
  confirmedLocationAddress = signal<string | null>(null);
  selectedLocationCoords: GeocodingResult | null = null;
  confirmedBringlistItems: BringlistItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private eventService: EventService,
    private storageService: StorageService
  ) {
    this.step1FormGroup = this.formBuilder.group({
      eventTitle: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.step2FormGroup = this.formBuilder.group({
      eventDateTime: ['', Validators.required]
    });
    this.step3FormGroup = this.formBuilder.group({
      location: ['', Validators.required],
    });
    this.step4FormGroup = this.formBuilder.group({
      image: ['', Validators.required],
      allowedPlusOne: [false, Validators.required],
    });
    this.step5FormGroup = this.formBuilder.group({
      bringList: [''],
    })
  }

  onStepChange(event: any) {
    this.isStep3Active.set(event.selectedIndex === 2);
  }

  onBringlistConfirmed(items: BringlistItem[]):void {
    this.confirmedBringlistItems = items;
    console.log('✅ Items confirmados:', items);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.currentEventId.set(id);
        this.loadEventForEdit(id);
      } else {
        this.isEditMode.set(false);
        this.currentEventId.set(null);
      }
    })
  }
  async onFileSelected(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.selectedFileName = file.name;
      try {
        const imageUrl = await this.storageService.uploadImage(file);
        this.step4FormGroup.patchValue({ image: imageUrl });
      } catch (error) {
      }
    }
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  async onSubmit() {
    if (!this.step1FormGroup.valid || !this.step2FormGroup.valid || !this.step3FormGroup.valid || !this.step4FormGroup.valid ) {
      return;
    }

    const user = this.authService.currentUser();
      if (!user) {
        return;
      };

    const imageUrl = this.step4FormGroup.value.image;
    const eventData: EventFormDTO = {
      title: this.step1FormGroup.value.eventTitle,
      description: this.step1FormGroup.value.description,
      eventDateTime: this.step2FormGroup.value.eventDateTime,
      location: {
        alias: this.step3FormGroup.value.location,
        address: this.selectedLocationCoords?.displayName || '',
        latitude: this.selectedLocationCoords?.latitude,
        longitude: this.selectedLocationCoords?.longitude
      },
      imageUrl: imageUrl  || '',
      allowPlusOne: this.step4FormGroup.value.allowedPlusOne,
      bringList: this.step5FormGroup.value.bringList || false,
      bringListItems: this.confirmedBringlistItems
    };

    try {
      if (this.isEditMode()) {
        const eventId = this.currentEventId();
        await this.eventService.updateEvent(eventId!, eventData);
        this.router.navigate(['/event-preview', eventId]);
      } else {
        this.eventService.eventPreview.set(eventData);
        this.router.navigate(['/event-preview']);
      }   
    } catch (error:any) {
      console.error('Error al crear el evento:', error);
    };
  };

  async loadEventForEdit(id: string) {
    try {
      const event = await this.eventService.getEventById(id);
      this.step1FormGroup.patchValue({
        eventTitle: event.title,
        description: event.description,
      });
      this.step2FormGroup.patchValue({
        eventDateTime: event.eventDateTime,
      });
      this.step3FormGroup.patchValue({
        location: event.location.alias,
      });
      this.step4FormGroup.patchValue({
        image: event.imageUrl,
        allowedPlusOne: event.allowPlusOne,
        bringList: event.bringList,
      });
    } catch (error) {
      console.error('Error al cargar el evento:', error);
    }
  }

  onLocationSelected(location: GeocodingResult) {
    this.confirmedLocationAddress.set(location.displayName);
    this.selectedLocationCoords = location;
  }
}
