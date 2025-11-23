import { AfterViewInit, Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { GeocodingResult } from '../../../core/models/event.model';
import * as L from 'leaflet';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.setIcon(defaultIcon);

@Component({
  selector: 'app-map-location',
  imports: [ReactiveFormsModule],
  templateUrl: './map-location.html',
  styleUrl: './map-location.css',
  standalone: true
})
export class MapLocation implements AfterViewInit{
  @Output() locationSelected = new EventEmitter<GeocodingResult>();

  selectedLocation = signal<GeocodingResult | null>(null);
  confirmedLocation = signal<string | null>(null);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  map: L.Map | null = null;
  marker: L.Marker | null = null;
  addressInput = new FormControl('');

  
  constructor(private geocodingService: GeocodingService) {}
  

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.waitForMapContainerAndInit();
    });
  }

  private waitForMapContainerAndInit() {
  const container = document.getElementById('map-container');
  
  if (!container) {
    console.error('Map container not found');
    return;
  }
    if (container.offsetHeight > 0) {
    this.initializeMap();
    this.setupAddressListener();
  } else {
    const observer = new MutationObserver(() => {
      if (container.offsetHeight > 0) {
        observer.disconnect();
        this.initializeMap();
        this.setupAddressListener();
      }
    });
    observer.observe(container, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    setTimeout(() => {
      observer.disconnect();
      this.initializeMap();
      this.setupAddressListener();
    }, 3000);
  }
}

  private setupAddressListener() {
    this.addressInput.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(address => {
        if (!address || address.trim() === '') {
          this.errorMessage.set(null);
        }
      });
  }

  async searchAddress(address: string) {
    if (!address || address.trim() === '') {
      this.errorMessage.set('Please include an address');
      return;
    }

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

  private updateMapMarker(latitude: number, longitude: number, address: string) {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    this.map.setView([latitude, longitude], 13);

    if (this.marker) {
      this.marker.setLatLng([latitude, longitude]);
      this.marker.setPopupContent(address);
      this.marker.openPopup();
    } else {
      this.marker = L.marker([latitude, longitude])
      .bindPopup(address)
      .openPopup()
      .addTo(this.map!);
    }
    this.addressInput.setValue(address);
  }

  confirmLocation() {
    const location = this.selectedLocation();
    if (location) {
      this.confirmedLocation.set(location.displayName);
      this.locationSelected.emit(location);
    }
  }

  private initializeMap() {
  if (this.map) return;

  setTimeout(() => {
    try {
      this.map = L.map('map-container').setView([42.4627, -2.4449], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Solo uno
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, 100);
}
}

