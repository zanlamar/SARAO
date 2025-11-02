import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatRadioModule, MatTimepickerModule, Footer],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  standalone: true
})
export class EventForm {
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;

  selectedFileName: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.step1FormGroup = this.formBuilder.group({
      eventName: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.step2FormGroup = this.formBuilder.group({
      eventDescription: ['', Validators.required],
      image: ['', Validators.required],
      allowedPlus1: ['', Validators.required]
    });

    this.step3FormGroup = this.formBuilder.group({
      bringList: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.step2FormGroup.patchValue({ image: file });
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onSubmit() {
    if (this.step1FormGroup.valid && this.step2FormGroup.valid && this.step3FormGroup.valid) {
      console.log('Formulario completado:', {
        step1: this.step1FormGroup.value,
        step2: this.step2FormGroup.value,
        step3: this.step3FormGroup.value
      });
      // Aquí datos al backend
    }
  }
}
