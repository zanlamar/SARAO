import { Injectable } from "@angular/core";
import { EventWithStats } from "../models/event.model";
import { EventDataService } from "./event-data.service";
import { EventService } from "./event.service";
import { AuthService } from "./auth.service";
import { SupabaseService } from "./supabase.service";
import { getSupabaseUserId } from "../helpers-supabase/event.mapper";

@Injectable ({
    providedIn: 'root',
})
export class EventStatsService {
    constructor(
        private eventDataService: EventDataService, 
        private authService: AuthService,
        private supabaseService: SupabaseService
    ) {}


    async getLoggedUserEventsWithStats(): Promise<EventWithStats[]> {
        try {
            const userId = await getSupabaseUserId(this.authService, this.supabaseService);
            const events = await this.eventDataService.getEventsByUserId(userId);
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
    }

    async getEventStatsWithAttendees(eventId: string): Promise<{
        stats: { confirmed: number; notComing: number; undecided: number; pending: number };
        attendees: { confirmed: string[]; notComing: string[]; pending: string[]; undecided?: string[] };
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

}