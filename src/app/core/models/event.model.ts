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

export interface EventWithStats extends Event {
    confirmed: number;
    notComing: number;
    undecided: number;
    pending: number;
    totalInvites: number;
    percentageConfirmed: number;
}

