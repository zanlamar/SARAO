export interface EventFormDTO {
    title: string;
    description: string;
    eventDate: Date;
    eventTime: string
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
    userId: string;     // del auth
    createdAt: Date;
    updatedAt: Date;
    inviteUrl?: string;
    eventStatus?: 'draft' | 'active' | 'closed';
}

export interface Event extends EventFormDTO, EventFromDB {
}
