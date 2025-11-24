import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";
import { environment, storage } from "../../../environments/environment";
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(
        private supabaseService: SupabaseService)
    { }
    async uploadImage(file: File): Promise<string> {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = fileName;
        try {
        const { data, error } = await this.supabaseService.getClient()
            .storage
            .from('event-images')
            .upload(filePath, file);
        if (error) {
            console.error('Error al subir la imagen:', error);
            throw new Error(`Error al subir la imagen: ${error.message}`);
        }
    
        const imageUrl = `${storage.supabaseUrl}/storage/v1/object/public/event-images/${fileName}`;
        return imageUrl;
        } catch (err: any) {
            throw err;
        }
    }
}   
