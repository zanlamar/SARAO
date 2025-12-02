import { Injectable } from "@angular/core";
import { Event } from "../models/event.model";
import { SupabaseService } from "./supabase.service";
import { mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class EventDataService {
    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }
    
    async insertEvent(eventToInsert: any): Promise<Event> {
        const { data, error } = await this.supabaseService.getClient()
            .from('events')
            .insert([eventToInsert])
            .select();
        if (error) {
            console.error('❌ ERROR EN INSERT:', error);
            throw new Error(error.message);
        }
        return mapSupabaseResponseToEvent(data[0]);
    }

    async getEventById (eventId: string): Promise<Event> {
        const { data, error } = await this.supabaseService.getClient()
            .from('events')
            .select()
            .eq('id', eventId)
            .single();
        if (error) throw new Error(error.message);
        return mapSupabaseResponseToEvent(data);
    }

    async getEventsByUserId(userId: string): Promise<Event[]> {
        const { data, error } = await this.supabaseService.getClient()
            .from('events')
            .select()
            .eq('creator_id', userId);
        if (error) throw new Error(error.message);
        return data.map((event: any) => mapSupabaseResponseToEvent(event));
    }

    async updateEvent(eventId: string, userId: string, eventToUpdate: any): Promise<Event> {
        const { data, error } = await this.supabaseService.getClient()
            .from('events')
            .update(eventToUpdate)
            .eq('id', eventId)
            .eq('creator_id', userId)
            .select();
        if (error) throw new Error(error.message);  
        return mapSupabaseResponseToEvent(data[0]);
    }

    async deleteEvent(eventId: string, userId: string): Promise<void> {
        const { error } = await this.supabaseService.getClient()
            .from('events')
            .delete()
            .eq('id', eventId)
            .eq('creator_id', userId);            
        if (error) throw new Error(error.message);  
    }

    async getEventStats(eventId: string): Promise<{
        stats: { confirmed: number; notComing: number; undecided: number; pending: number },
        attendees: { confirmed: string[]; notComing: string[]; undecided: string[]; pending: string[] };}>
        {
        const { data, error } = await this.supabaseService.getClient()
            .from('invitations')
            .select('email, rsvp_status')
            .eq('event_id', eventId);
        
        if (error) throw new Error(error.message);
        
        const stats = data.reduce((acc: any, inv: any) => {
            acc[inv.rsvp_status] = (acc[inv.rsvp_status] || 0) + 1;
            return acc;
        }, {});
        
        const attendees = {
            confirmed: data
            .filter((inv: any) => inv.rsvp_status === 'yes')
            .map((inv: any) => inv.email),

            notComing: data
            .filter((inv: any) => inv.rsvp_status === 'no')
            .map((inv: any) => inv.email),

            pending: data
            .filter((inv: any) => inv.rsvp_status === 'not_responded')
            .map((inv: any) => inv.email),

            undecided: data
            .filter((inv: any) => inv.rsvp_status === 'maybe')
            .map((inv: any) => inv.email),

        };

        return {
            stats: {
            confirmed: stats.yes || 0,
            notComing: stats.no || 0,
            undecided: stats.maybe || 0,
            pending: stats.not_responded || 0
        }, 
            attendees
        };
    }
}



