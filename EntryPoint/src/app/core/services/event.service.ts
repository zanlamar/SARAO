import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { Event, EventFormDTO } from "../models/event.model";
import { SupabaseService } from "./supabase.service";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, mapSupabaseResponseToEvent, getSupabaseUserId } from "../helpers/event.mapper";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService,
        private storageService: StorageService
    ) { }   


    // PARA CREAR UN EVENTO
    async createEvent(eventData: EventFormDTO, imageFile: File | null): Promise<Event> {
        //buscamos el userId
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        console.log('✅ userId obtenido:', userId, 'tipo:', typeof userId);

        let imageUrl = null; 
        if (imageFile) {
            imageUrl = await this.storageService.uploadImage(imageFile);
            console.log('✅ Imagen subida:', imageUrl);
        }
        eventData.imageUrl = imageUrl || '';
        console.log('🖼️ eventData.imageUrl después de asignar:', eventData.imageUrl);
        console.log('🖼️ imageUrl original:', imageUrl);




        // preparamos los datos
        const eventToInsert = mapEventFormDTOToSupabase(eventData, userId);
        console.log('📸 image_url en eventToInsert:', eventToInsert.image_url);
        console.log('📤 Datos a insertar:', eventToInsert);
        console.log('🔑 creator_id en los datos:', eventToInsert.creator_id);



        // lo insertamos
        const { data, error } = await this.supabaseService.getClient()
        .from('events')
        .insert([eventToInsert])
        .select();
        console.log('📊 Respuesta INSERT completa:', JSON.stringify({ data, error }, null, 2));


        if (error) throw new Error(error.message);

        //mapear y devolver
        return mapSupabaseResponseToEvent(data[0]);

    }

    // PARA ENCONTRAR LOS EVENTOS DE UN USER
    getEvents(): Observable<Event[]> {
        // lo convertimos en observable
        return from(this.getUserEvents());
    }

    private async getUserEvents(): Promise<Event[]> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);

        const { data, error } = await this.supabaseService.getClient()
        .from('events')
        .select()
        .eq('creator_id', userId);

        if (error) throw new Error(error.message);

        return data.map((event: any) => mapSupabaseResponseToEvent(event));
    }


    // PARA MODIFICAR
    updateEvent(eventId: string, eventData: EventFormDTO): Observable<Event> {
        return from(this.updateEventAsync(eventId, eventData));
    }
    private async updateEventAsync(eventId: string, eventData: EventFormDTO): Promise<Event> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        const eventToUpdate = mapEventFormDTOToSupabase(eventData, userId);

        const { data, error } = await this.supabaseService.getClient()
        .from('events')
        .update(eventToUpdate)
        .eq('id', eventId)
        .eq('creator_id', userId)
        .select();

        if (error) throw new Error(error.message);  

        return mapSupabaseResponseToEvent(data[0]);
    }

    // PARA BORRAR
    deleteEvent(eventId: string): Observable<void> {
        return from(this.deleteEventAsync(eventId));
    }
    private async deleteEventAsync(eventId: string): Promise<void> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);

        const { error } = await this.supabaseService.getClient()
            .from('events')
            .delete()
            .eq('id', eventId)
            .eq('creator_id', userId);

        if (error) throw new Error(error.message);
    }

    
}