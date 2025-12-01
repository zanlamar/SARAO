import { SupabaseService } from "../services/supabase.service";
import { AuthService } from "../services/auth.service";
import { EventFormDTO, Event } from "../models/event.model";

export async function getSupabaseUserId(
    authService: AuthService,
    supabaseService: SupabaseService
): Promise<string> {
    const firebaseUser = authService.currentUser();
    if (!firebaseUser) {
        throw new Error('No authenticated Firebase user when resolving Supabase user ID');
    }
    const firebaseUid = firebaseUser.uid;

    const { data, error } = await supabaseService.getClient()
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .maybeSingle();

    if (error) {
        console.error('Error al buscar el usuario:', error);
        throw new Error(`Error on finding the user: ${error.message}`);
    }
    if (!data) {
        console.error('User not found in the database');
        throw new Error('User not found in the database');
    }
    return data.id;
}

export function mapEventFormDTOToSupabase(
    eventData: EventFormDTO,
    userId: string
): any {
    const realDate = eventData.eventDateTime instanceof Date 
        ? eventData.eventDateTime.toISOString()
        : eventData.eventDateTime;

    return {
        creator_id: userId,
        title: eventData.title,
        description: eventData.description,
        real_date: realDate,
        image_url: eventData.imageUrl || null,
        location_alias: eventData.location.alias,
        location_address: eventData.location.address || null,    
        location_latitude: eventData.location.latitude || null,    
        location_longitude: eventData.location.longitude || null,  
        allow_companion: eventData.allowPlusOne, 
        bring_list: eventData.bringList || false,
        bring_list_items: eventData.bringListItems || [], 
        updated_at: new Date()
    };
}

export function mapSupabaseResponseToEvent(data: any): Event {
    return {
        title: data.title,
        description: data.description,
        eventDateTime: new Date (data.real_date), 
        imageUrl: data.image_url,
        location: {
            alias: data.location_alias,
            address: data.location_address || '',
            latitude: data.location_latitude,
            longitude: data.location_longitude
        },
        allowPlusOne: data.allow_companion,
        bringList: data.bring_list,
        bringListItems: typeof data.bring_list_items === 'string' 
            ? JSON.parse(data.bring_list_items) 
            : (data.bring_list_items || []),
        id: data.id,
        userId: data.creator_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        inviteUrl: `/event/${data.id}`,
        eventStatus: 'active'
    };
}
