import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ShareUrlService {
    generateShareUrl(eventId: string): string {
        return `${window.location.origin}/shareable-url/${eventId}`;
    }

    async copyToClipboard(text: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        return false;
        }
    }
}