import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Event } from '../models/event.model';
import { mapSupabaseResponseToEvent } from '../helpers-supabase/event.mapper';

@Injectable ({
    providedIn: 'root',
})
export class InvitationService {
    constructor  (
        private supabaseService: SupabaseService, 
        private authService: AuthService
    ) {}

    async saveInvitation(eventId: string, guestId: string, email: string): Promise<void> {
        try {
            if (!eventId) {
                throw new Error('No eventID to save invite');
            }

            if (!guestId) {
                throw new Error('No guestID to save invite');
            }
            
            const { data: existing, error: selectError } = await this.supabaseService.getClient()
                .from('invitations')
                .select('id')
                .eq('event_id', eventId)
                .eq('guest_id', guestId)
                .maybeSingle();
        
            if (selectError) {
                throw new Error('No previous invite to check: ' + selectError.message);
            }

            if (existing) {
                return;
            }

            const { error: insertError } = await this.supabaseService.getClient()
                .from('invitations')
                .insert({ 
                    event_id: eventId,
                    guest_id: guestId,
                    email: email,
                    rsvp_status: 'not_responded' 
                });

            if (insertError) {
                throw new Error('Not possible to create the invite: ' + insertError.message);
            }
        } catch (err) {
        console.error('Error in saveInvitation:', err);
        throw err;
        }
    }

    async updateRSVP(eventId: string, guestId: string, response: 'yes' | 'no' | 'maybe'): Promise<void> {
        try {
            if (!eventId) {
            throw new Error('No eventID to update RSVP');
            }

            if (!guestId) {
            throw new Error('No guestID to update RSVP');
            }

            const { data, error } = await this.supabaseService.getClient()
                .from('invitations')
                .update({ rsvp_status: response })
                .eq('event_id', parseInt(eventId))
                .eq('guest_id', guestId);
            if (error) throw new Error(error.message);
        } catch (err) {
            console.error('Error in updateRSVP:', err);
            throw err;
        }
    };

    async getGuestEvents(): Promise<Event[]> {
        const user = this.authService.currentUser();
        if (!user) return [];

        try {
            const { data, error } = await this.supabaseService.getClient()
                .from('invitations')
                .select('event_id')
                .eq('guest_id', user.uid)
                .in('rsvp_status', ['yes', 'maybe']);
            if (error || !data?.length) {
                return [];
            }
            const eventIds = data.map((inv: any) => inv.event_id);
            const { data: events, error: eventsError } = await this.supabaseService.getClient()
                .from('events')
                .select()
                .in('id', eventIds);

            

            if (eventsError) throw new Error(eventsError.message);
            const result = events.map((event: any) => {
                const mapped = mapSupabaseResponseToEvent(event);
                (mapped as any).isGuest = true;
                return mapped;
            });
            return result;
        } catch (error) {
            console.error('❌ Error cargando guest events:', error);
            return [];
        }
    }














}
