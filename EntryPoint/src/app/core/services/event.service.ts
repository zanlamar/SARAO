import { Injectable, signal } from "@angular/core";
import { from, Observable } from "rxjs";
import { Event, EventFormDTO } from "../models/event.model";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, getSupabaseUserId } from "../helpers-supabase/event.mapper";
import { StorageService } from "./storage.service";
import { EventDataService } from "./event-data.service";
import { SupabaseService } from "./supabase.service";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    eventPreview = signal<EventFormDTO | null>(null);
    imageFilePreview: File | null = null;
    
    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private eventDataService: EventDataService,
        private supabaseService: SupabaseService
    ) { }   


    // PARA CREAR UN EVENTO
    async createEvent(eventData: EventFormDTO, imageFile: File | null): Promise<Event> {
        //buscamos el userId
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        if (imageFile) {
            const imageUrl = await this.storageService.uploadImage(imageFile);
            eventData.imageUrl = imageUrl;
        }
        // preparamos los datos
        const eventToInsert = mapEventFormDTOToSupabase(eventData, userId);
        return this.eventDataService.insertEvent(eventToInsert);
    }

    // OBTENER EVENTO POR ID
    async getEventById(eventId: string): Promise<Event> {
        return this.eventDataService.getEventById(eventId);
    }

    // PARA TENER LOS EVENTOS DE UN USUARIO LOGGED
    async getLoggedUserEvents(): Promise<Event[]> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        return this.eventDataService.getEventsByUserId(userId);
    }

    // PARA MODIFICAR
    async updateEvent(eventId: string, eventData: EventFormDTO): Promise<Event> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        const eventToUpdate = mapEventFormDTOToSupabase(eventData, userId);
        return this.eventDataService.updateEvent(eventId, userId, eventToUpdate);
    }
    
    // PARA BORRAR
    async deleteEvent(eventId: string): Promise<void> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        return this.eventDataService.deleteEvent(eventId, userId);
    }

    generateShareUrl(eventId: string): string {
        return `/event/${eventId}`;
    }
}