export interface EventFormDTO {
    title: string;
    description: string;
    // eventDate: Date;
    // eventTime: string;
    eventDateTime: Date;
    imageUrl: string;
    location: {
        alias: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    };
    allowPlusOne: boolean;
    bringList?: boolean;
}

export interface EventFromDB {
    id: string;
    userId: string;  
    createdAt: Date;
    updatedAt: Date;
    inviteUrl?: string;
    eventStatus?: 'draft' | 'active' | 'closed';
}

export interface Event extends EventFormDTO, EventFromDB {
    inviteUrl: string;
    creatorName?: string;
    RSVPstatus?: { 
        yes: number;
        maybe: number;
        no: number;
        total: number;
    };
}

export interface Invitation {
    id: string;
    eventid: string;
    guestid: string;
    status: 'pending' | 'accepted' | 'declined';
    rsvp_status: 'yes' | 'maybe' | 'no' | 'not_responded';
    created_at: Date;
    updated_at: Date;
}


export interface Notification {
    id: string; 
    recipient_id: string;
    type: 'rspv_response' | 'event_invitation' | 'guest_request' | 'event_cancelled';
    notification_title: string;
    message: string;
    related_event_id?: string;
    related_user_id?: string;
    read: boolean;
    created_at: Date;
}
