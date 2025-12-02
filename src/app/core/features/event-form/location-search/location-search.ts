import { Component, Output, EventEmitter, signal } from '@angular/core';
import { GeocodingService } from '../../../../core/services/geocoding.service';
import { GeocodingResult } from '../../../../core/models/event.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-search',
  imports: [
    CommonModule, 
    ReactiveFormsModule],
  templateUrl: './location-search.html',
  styleUrl: './location-search.css',
  standalone: true
})
export class LocationSearch {
  @Output() locationSelected = new EventEmitter<GeocodingResult>();

  addressInput = new FormControl('');
  selectedLocation = signal<GeocodingResult | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private geocodingService: GeocodingService) {}

  async searchAddress(address: string) {
    if (!address || address.trim() === '') {
      this.errorMessage.set('Please enter an address');
      return;
    }

    this.isLoading.set(true);

    try {
      const result = await this.geocodingService.geocodeAddress(address);
      this.selectedLocation.set(result);
      this.errorMessage.set(null);
    } catch (error: any) {
      this.errorMessage.set(error.message);
      this.selectedLocation.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  confirmLocation() {
    const location = this.selectedLocation();
    if (location) {
      this.locationSelected.emit(location);
      this.addressInput.reset();
      this.selectedLocation.set(null);
    }
  }
}

