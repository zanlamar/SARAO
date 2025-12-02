import { Injectable, signal } from "@angular/core";
import { Event, EventFormDTO, EventWithStats } from "../models/event.model";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, getSupabaseUserId, mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";
import { StorageService } from "./storage.service";
import { EventDataService } from "./event-data.service";
import { SupabaseService } from "./supabase.service";
import { InvitationService } from "./invitation.service";
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
        private invitationService: InvitationService
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
        try {
            const events = await this.getLoggedUserEvents();
            const eventsWithStats: EventWithStats[] = [];

            for (const event of events) {
                try {
                    const stats = await this.eventDataService.getEventStats(event.id);
                    const eventWithStats: EventWithStats = {
                        ...event,
                        confirmed: stats.stats.confirmed || 0,
                        notComing: stats.stats.notComing || 0,
                        undecided: stats.stats.undecided || 0,
                        pending: stats.stats.pending || 0,
                        totalInvites: 0,
                        percentageConfirmed: 0
                    };
                    eventsWithStats.push(eventWithStats);
                } catch (error) {
                    console.error(`Error cargando stats del evento ${event.id}:`, error);
                }
            }
            return eventsWithStats;
        } catch (error) {
            console.error('Error obteniendo eventos con stats:', error);
        return [];
        }
    };

    async getEventStatsWithAttendees(eventId: string): Promise<{
        stats: { confirmed: number; notComing: number; undecided: number; pending: number };
        attendees: { confirmed: string[]; notComing: string[]; pending: string[] };
    }> {
        return this.eventDataService.getEventStats(eventId);
    }

    async getAttendeesByEvent(eventId: string): Promise<{
        confirmed: string[];
        notComing: string[];
        pending: string[];
        undecided?: string[];
    }> {
    const result = await this.eventDataService.getEventStats(eventId);
    return result.attendees;
    }

    async getCurrentSupabaseUserId(): Promise<string> {
        if (!this.supabaseUserIdCache) {
            this.supabaseUserIdCache = await getSupabaseUserId(this.authService, this.supabaseService);
        }
        return this.supabaseUserIdCache;
    }
}
