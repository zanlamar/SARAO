import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GeocodingResult } from '../models/event.model';

interface NominatimResponse {
    lat: string;
    lon: string;
    display_name: string;
    address?: any;
}

@Injectable({ 
    providedIn: 'root' 
})

export class GeocodingService {
    private nominatimUrl = 'https://nominatim.openstreetmap.org';

    constructor(private http: HttpClient) {}

    async geocodeAddress(address: string): Promise<GeocodingResult> {
        if (!address || address.trim() === '') {
            throw new Error('Address is required');
        }

        try {
            const response = await firstValueFrom(this.http.get<NominatimResponse[]>(`${this.nominatimUrl}/search`, {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1
                }
            })
            );
        
            if (!response || response.length === 0) {
                throw new Error(`Address not found: "${address}"`);
            }
        
            const result = response[0];
            return this.parseNominatimResponse(result);
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw new Error(`Error geocoding address: ${error}`);
        }
    }

    private parseNominatimResponse(response: NominatimResponse): GeocodingResult {
        return {
            latitude: parseFloat(response.lat),
            longitude: parseFloat(response.lon),
            displayName: response.display_name
        };
    }
}
