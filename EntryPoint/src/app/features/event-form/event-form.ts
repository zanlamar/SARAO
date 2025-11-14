import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { EventFormDTO } from '../../core/models/event.model';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

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
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  standalone: true
})
export class EventForm implements OnInit {

  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;
  selectedFileName = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private eventService: EventService,
    private storageService: StorageService
  ) {
    this.step1FormGroup = this.formBuilder.group({
      eventTitle: ['', Validators.required],
      location: ['', Validators.required],
      eventDateTime: ['', Validators.required]

    });

    this.step2FormGroup = this.formBuilder.group({
      description: ['', Validators.required],
      image: ['', Validators.required],
      allowedPlusOne: [false, Validators.required],

    });

    this.step3FormGroup = this.formBuilder.group({
      bringList: ['']
    });
  }

  ngOnInit(): void {
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.selectedFileName = file.name;

      try {
        const imageUrl = await this.storageService.uploadImage(file);
        this.step2FormGroup.patchValue({ image: imageUrl });
        console.log('Imagen subida:', imageUrl);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  async onSubmit() {
    // primero se chequea que no haya error 
    if (!this.step1FormGroup.valid || !this.step2FormGroup.valid || !this.step3FormGroup.valid) {
      console.log('Error. Formulario incompleto');
      return;
    }

    // despues se chequea el ID del usuario
    const user = this.authService.currentUser();
      if (!user) {
        console.log('Error. No hay usuario autenticado');
        return;
      };

    const imageUrl = this.step2FormGroup.value.image;
    // const imageFile = this.step2FormGroup.value.image;
    console.log('🔍 imageUrl guardada:', imageUrl);

    // se recogen los valores de los 3 steps y se rellena el objeto
    const eventData: EventFormDTO = {
      title: this.step1FormGroup.value.eventTitle,
      description: this.step2FormGroup.value.description,
      // eventDate: this.adjustDateForTimezone(this.step1FormGroup.value.startDate),
      // eventTime: this.step1FormGroup.value.startTime,
      eventDateTime: this.step1FormGroup.value.eventDateTime,
      location: {
        alias: this.step1FormGroup.value.location,
        address: '',
      },
      imageUrl: imageUrl  || '',
      allowPlusOne: this.step2FormGroup.value.allowedPlusOne,
      bringList: this.step3FormGroup.value.bringList || false,
    };
    console.log('Datos recogidos:', eventData);
    console.log('🔑 Firebase UID actual:', this.authService.currentUser().uid);

    // se llama al servicio para crear el evento de una vez
    try {
      // preview temporal antes de guardar
      this.eventService.eventPreview.set(eventData);
      console.log('📋 EventFormDTO guardado:', JSON.stringify(eventData, null, 2));  // ✅ NUEVO
      
      console.log('Evento guardado en preview:', eventData);
      this.router.navigate(['/event-preview']);
      
    // TODO: Limpiar formulario y redirigir a la página de eventos
    } catch (error:any) {
      console.error('Error al crear el evento:', error);
      console.error('❌ ERROR COMPLETO:', error);
      console.error('❌ Mensaje:', error.message);
      console.error('❌ Stack:', error.stack);
    };
  }

  // private adjustDateForTimezone(date: Date): Date {
  //   if (!date) return new Date();
  //   const year = date.getFullYear();
  //   const month = date.getMonth();
  //   const day = date.getDate();
    
  //   return new Date(year, month, day, 0, 0, 0, 0);
  // }
}
