import { SupabaseService } from "../services/supabase.service";
import { AuthService } from "../services/auth.service";
import { EventFormDTO, Event } from "../models/event.model";

// funcion para obtener el ID del usuario en supabase 

export async function getSupabaseUserId(
    authService: AuthService,
    supabaseService: SupabaseService
): Promise<string> {
    const firebaseUid = authService.currentUser().uid;

    const { data, error } = await supabaseService.getClient()
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .maybeSingle();

    if (error) throw new Error(`Error on finding the user: ${error.message}`);
    if (!data) throw new Error('User not found in the database');
    return data.id;
}


// funcion para mapear el evento, de EventFormDTO a formato Supabase

export function mapEventFormDTOToSupabase(
    eventData: EventFormDTO,
    userId: string
): any {
    return {
        creator_id: userId,
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.eventDate,
        event_time: eventData.eventTime,
        image_url: eventData.imageUrl,
        location_alias: eventData.location.alias,
        allow_companion: eventData.allowPlusOne, 
        bring_list: eventData.bringList || false,
        updated_at: new Date()
    };
}


// funcion para mapear la respuesta de Supabase a tipo Event

export function mapSupabaseResponseToEvent(data: any): Event {
    return {
        title: data.title,
        description: data.description,
        eventDate: new Date(data.event_date),
        eventTime: data.event_time,
        imageUrl: data.image_url,
        location: {
            alias: data.location_alias,
            address: data.location_address || '',
            latitude: data.location_latitude,
            longitude: data.location_longitude
        },
        allowPlusOne: data.allow_companion,
        bringList: data.bring_list,
        
        id: data.id,
        userId: data.creator_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        inviteUrl: `/event/${data.id}`,
        eventStatus: 'active'
    };
}