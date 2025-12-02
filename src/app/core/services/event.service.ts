import { Injectable, signal } from "@angular/core";
import { Event, EventFormDTO, EventWithStats } from "../models/event.model";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, getSupabaseUserId, mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";
import { StorageService } from "./storage.service";
import { EventDataService } from "./event-data.service";
import { SupabaseService } from "./supabase.service";
import { InvitationService } from "./invitation.service";
import { EventStatsService } from "./event-stats.service";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    eventPreview = signal<EventFormDTO | null>(null);
    imageFilePreview: File | null = null;
    private supabaseUserIdCache: string | null = null;

    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private eventDataService: EventDataService,
        private supabaseService: SupabaseService,
        private invitationService: InvitationService,
        private eventStatsService: EventStatsService
    ) {}

    async createEvent(eventData: EventFormDTO, imageFile: File | null): Promise<Event> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        if (imageFile) {
            const imageUrl = await this.storageService.uploadImage(imageFile);
            eventData.imageUrl = imageUrl;
        }
        const eventToInsert = mapEventFormDTOToSupabase(eventData, userId);
        return this.eventDataService.insertEvent(eventToInsert);
    }

    async getEventById(eventId: string): Promise<Event> {
        return this.eventDataService.getEventById(eventId);
    }

    async getLoggedUserEvents(): Promise<Event[]> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        return this.eventDataService.getEventsByUserId(userId);
    }

    async updateEvent(eventId: string, eventData: EventFormDTO): Promise<Event> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        const eventToUpdate = mapEventFormDTOToSupabase(eventData, userId);
        return this.eventDataService.updateEvent(eventId, userId, eventToUpdate);
    }
    
    async deleteEvent(eventId: string): Promise<void> {
        const userId = await getSupabaseUserId(this.authService, this.supabaseService);
        return this.eventDataService.deleteEvent(eventId, userId);
    }

    generateShareUrl(eventId: string): string {
        return `/event/${eventId}`;
    }

    async saveInvitation(eventId: string, guestId: string, email: string): Promise<void> {
        return this.invitationService.saveInvitation(eventId, guestId, email);
    }

    async updateRSVP(eventId: string, guestId: string, response: 'yes' | 'maybe' | 'no'): Promise<void> {
        return this.invitationService.updateRSVP(eventId, guestId, response);
    }

    async getGuestEvents(): Promise<Event[]> {
        return this.invitationService.getGuestEvents();
    }

    async getLoggedUserEventsWithStats(): Promise<EventWithStats[]> {
        return this.eventStatsService.getLoggedUserEventsWithStats();
    }

    async getEventStatsWithAttendees(eventId: string) {
        return this.eventStatsService.getEventStatsWithAttendees(eventId);
    }

    async getAttendeesByEvent(eventId: string) {
        return this.eventStatsService.getAttendeesByEvent(eventId);
    }

    async getCurrentSupabaseUserId(): Promise<string> {
        if (!this.supabaseUserIdCache) {
            this.supabaseUserIdCache = await getSupabaseUserId(this.authService, this.supabaseService);
        }
        return this.supabaseUserIdCache;
    }
}
