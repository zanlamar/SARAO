import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { GeocodingResult } from '../../../core/models/event.model';
import * as L from 'leaflet';
import { debounceTime } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-location',
  imports: [ReactiveFormsModule],
  templateUrl: './map-location.html',
  styleUrl: './map-location.css',
  standalone: true
})
export class MapLocation implements AfterViewInit{

  selectedLocation = signal<GeocodingResult | null>(null);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  map: L.Map | null = null;
  marker: L.Marker | null = null;
  addressInput = new FormControl('');

  constructor(private geocodingService: GeocodingService) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.setupAddressListener();
  }

  private setupAddressListener() {
    this.addressInput.valueChanges
    .pipe(debounceTime(500))
    .subscribe(address => {
      if (address && address.trim() !== '') {
        this.searchAddress(address);
      }
    });
  }

  private async searchAddress(address: string) {
    if (!address) return;
    this.isLoading.set(true);

    try { 
      const result = await this.geocodingService.geocodeAddress(address);
      this.selectedLocation.set(result);
      this.updateMapMarker(result.latitude, result.longitude, result.displayName);
      this.errorMessage.set(null);
    } catch (error: any) {
      this.errorMessage.set(error.message);
      this.selectedLocation.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  private initializeMap() {
    this.map = L.map('map-cotainer').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private updateMapMarker(latitude: number, longitude: number, address: string) {
    this.map?.flyTo([latitude, longitude], 13);

      if (this.marker) {
        this.marker.setLatLng([latitude, longitude]);
        this.marker.setPopupContent(address);
      } else {
        this.marker = L.marker([latitude, longitude])
        .bindPopup(address)
        .addTo(this.map!);
      }
      this.addressInput.setValue(address);
    }
  }


