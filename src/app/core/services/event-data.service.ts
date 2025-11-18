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
        const { data: existing } = await this.supabaseService.getClient()
        .from('invitations')
        .select('id')
        .eq('event_id', eventId)
        .eq('guest_id', guestId)
        .single();
    
    if (existing) {
        console.log('✅ Invitation ya existe, skipping');
        return;
    }
    
    const { error } = await this.supabaseService.getClient()
        .from('invitations')
        .insert({ 
            event_id: eventId,
            guest_id: guestId,
            email: email,
            rsvp_status: 'not_responded' 
        });
    
    if (error) throw new Error(error.message);
    }

    async updateRSVP(eventId: string, guestId: string, response: 'yes' | 'no' | 'maybe'): Promise<void> {
        const { data, error } = await this.supabaseService.getClient()
            .from('invitations')
            .update({ rsvp_status: response })
            .eq('event_id', parseInt(eventId))
            .eq('guest_id', guestId);
        if (error) throw new Error(error.message);
    }

    async getGuestEvents(): Promise<Event[]> {
        const user = this.authService.currentUser();
        console.log('👤 getGuestEvents - User:', user?.uid);
        
        if (!user) return [];

        try {
            const { data, error } = await this.supabaseService.getClient()
                .from('invitations')
                .select('event_id')
                .eq('guest_id', user.uid)
                .in('rsvp_status', ['yes', 'maybe']);

            console.log('🔍 Query invitations - data:', data);
            console.log('🔍 Query invitations - error:', error);

            if (error || !data?.length) {
                console.log('❌ No hay data o hay error');
                return [];
            }

            const eventIds = data.map((inv: any) => inv.event_id);
            console.log('📋 Event IDs encontrados:', eventIds);

            const { data: events, error: eventsError } = await this.supabaseService.getClient()
                .from('events')
                .select()
                .in('id', eventIds);

            console.log('📊 Eventos traídos:', events?.length);
            console.log('📊 Error eventos:', eventsError);

            if (eventsError) throw new Error(eventsError.message);
    
            const result = events.map((event: any) => {
                const mapped = mapSupabaseResponseToEvent(event);
                (mapped as any).isGuest = true;
                return mapped;
            });

            console.log('✅ Retornando guest events:', result.length);
            return result;
        } catch (error) {
            console.error('❌ Error cargando guest events:', error);
            return [];
        }
    }
}