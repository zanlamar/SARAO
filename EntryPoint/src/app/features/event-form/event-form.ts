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
import { EventFormDTO } from '../../core/models/event.model';

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatRadioModule, MatTimepickerModule, Footer],
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

  ) {
    this.step1FormGroup = this.formBuilder.group({
      eventTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      location: ['', Validators.required]
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
    // Aquí no necesitas nada aún
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; // Obtén el archivo del input
    if (file) {
      this.selectedFileName = file.name; // Guarda el nombre para mostrar
      this.step2FormGroup.patchValue({ image: file }); // Actualiza el formulario
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

    const imageFile = this.step2FormGroup.value.image;

    // se recogen los valores de los 3 steps y se rellena el objeto
    const eventData: EventFormDTO = {
      title: this.step1FormGroup.value.eventTitle,
      description: this.step2FormGroup.value.description,
      eventDate: new Date(this.step1FormGroup.value.startDate),
      eventTime: this.step1FormGroup.value.startTime,
      location: {
        alias: this.step1FormGroup.value.location,
        address: '',
      },
      imageUrl: '',
      allowPlusOne: this.step2FormGroup.value.allowedPlusOne,
      bringList: this.step3FormGroup.value.bringList || false,
    };
    console.log('Datos recogidos:', eventData);
    console.log('🔑 Firebase UID actual:', this.authService.currentUser().uid);

    // se llama al servicio para crear el evento de una vez
    try {
      // preview temporal antes de guardar
      this.eventService.eventPreview.set(eventData);
      this.eventService.imageFilePreview = imageFile;
      
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
}
