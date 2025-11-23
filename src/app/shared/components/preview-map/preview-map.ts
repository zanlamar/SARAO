import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-preview-map',
  imports: [],
  templateUrl: './preview-map.html',
  styleUrl: './preview-map.css',
  standalone: true
})
export class PreviewMap implements AfterViewInit {
  @Input() latitude: number | undefined = undefined;
  @Input() longitude: number | undefined = undefined;
  @Input() address: string = '';

  private map: L.Map | null = null;

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initializeMap();
    });
  }

  private initializeMap() {
    if (!this.latitude || !this.longitude) {
      console.log('❌ Sin coordenadas:', { latitude: this.latitude, longitude: this.longitude });
      return;
    }

    console.log('✅ Iniciando mapa con coords:', { latitude: this.latitude, longitude: this.longitude });

    try {
      const container = document.getElementById('event-map-container');
      console.log('🔍 Container encontrado?', !!container);

  
      this.map = L.map('event-map-container').setView(
        [this.latitude, this.longitude],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      console.log('✅ Mapa creado exitosamente');

      L.marker([this.latitude, this.longitude], { icon: defaultIcon })
        .bindPopup(this.address || 'Event Location')
        .openPopup()
        .addTo(this.map);

        // ← MÚLTIPLES invalidateSize para asegurar
        setTimeout(() => this.map?.invalidateSize(true), 100);
        setTimeout(() => this.map?.invalidateSize(true), 300);
        setTimeout(() => this.map?.invalidateSize(true), 600);

      setTimeout(() => {
        this.map?.invalidateSize();
        console.log('✅ invalidateSize ejecutado');
      }, 100);
    } catch (error) {
      console.error('❌ Error initializing event map:', error);
    }
  }
}

