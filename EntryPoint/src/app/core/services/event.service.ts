import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { Event, EventFormDTO } from "../models/event.model";
import { SupabaseService } from "./supabase.service";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, mapSupabaseResponseToEvent, getSupabaseUserId } from "../helpers/event.mapper";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }


    // PARA CREAR UN EVENTO
    async createEvent(eventData: EventFormDTO): Promise<Event> {
        //buscamos el userId
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);

        // preparamos los datos
        const eventToInsert = mapEventFormDTOToSupabase(eventData, userId);

        // lo insertamos
        const { data, error } = await this.supabaseService.getClient()
        .from('events')
        .insert([eventToInsert])
        .select();

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