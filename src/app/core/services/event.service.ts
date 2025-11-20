import { Injectable, signal } from "@angular/core";
import { Event, EventFormDTO, EventWithStats } from "../models/event.model";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, getSupabaseUserId, mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";
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
        return this.eventDataService.saveInvitation(eventId, guestId, email);
    }

    async updateRSVP(eventId: string, guestId: string, response: 'yes' | 'maybe' | 'no'): Promise<void> {
        return this.eventDataService.updateRSVP(eventId, guestId, response);
    }

    async getGuestEvents(): Promise<Event[]> {
        const user = this.authService.currentUser();
        if (!user) return [];

        try { 
            const { data, error} = await this.supabaseService.getClient()
                .from('invitations')
                .select('event_id')
                .eq('guest_id', user.uid)
                .in('rsvp_status', ['yes', 'maybe']);
            if (error || !data?.length) return [];

            const eventIds = data.map((inv: any) => inv.event_id);

            const { data: events, error: eventsError } = await this.supabaseService.getClient()
                .from('events')
                .select('*')
                .in('id', eventIds);
            if (eventsError) throw new Error(eventsError.message);
            
            return events.map((event: any) => {
                const mapped = mapSupabaseResponseToEvent(event);
                (mapped as any).isGuest = true;
                return mapped;
            }); 
        } catch (error) {
            console.error('❌ Error cargando guest events:', error);
            return [];
            }
        }

    async getLoggedUserEventsWithStats(): Promise<EventWithStats[]> {
        try {
            const events = await this.getLoggedUserEvents();
            const eventsWithStats: EventWithStats[] = [];

            for (let event of events) {
                try {
                    const stats = await this.eventDataService.getEventStats(event.id);
                    const eventWithStats: EventWithStats = {
                        ...event,
                        confirmed: stats.confirmed || 0,
                        notComing: stats.notComing || 0,
                        undecided: stats.undecided || 0,
                        pending: stats.pending || 0,
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
}
