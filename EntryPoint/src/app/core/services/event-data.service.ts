import { Injectable } from "@angular/core";
import { Event } from "../models/event.model";
import { SupabaseService } from "./supabase.service";
import { mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";

@Injectable({
    providedIn: 'root'
})

export class EventDataService {
    constructor(private supabaseService: SupabaseService) { }

    async insertEvent(eventToInsert: any): Promise<Event> {
        console.log('🔍 eventToInsert COMPLETO:', JSON.stringify(eventToInsert, null, 2));
        console.log('🔍 Campos:', Object.keys(eventToInsert));
        
        const { data, error } = await this.supabaseService.getClient()
            .from('events')
            .insert([eventToInsert])
            .select();

        console.log('📤 Respuesta de Supabase - data:', data);
        console.log('📤 Respuesta de Supabase - error:', error);
        
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

    async saveInvitation(eventId: string, guestId: string, email: string): Promise<void> {
        const { error } = await this.supabaseService.getClient()
            .from('invitations')
            .upsert({ 
                event_id: eventId,
                guest_id: guestId,
                email: email,
                rsvp_status: 'not_responded' 
            }, {
                onConflict: 'guest_id,event_id'
            });
        if (error) throw new Error(error.message);
    }

    async updateRSVP(eventId: string, guestId: string, response: 'yes' | 'no' | 'maybe'): Promise<void> {
        const { data, error } = await this.supabaseService.getClient()
            .from('invitations')
            .update({ rsvp_status: response })
            .eq('event_id', eventId)
            .eq('guest_id', guestId);
        if (error) throw new Error(error.message);
    }
}