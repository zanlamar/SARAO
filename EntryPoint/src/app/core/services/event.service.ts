import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Event, EventFormDTO } from "../models/event.model";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    // BehaviourSubject para que los componentes se suscriban a cambios 
    private events$ = new BehaviorSubject<Event[]>([]);


    constructor() { }

    /**
     * Expone eventos como Observable (solo lectura)
     */
    getEvents(): Observable<Event[]> {
        return this.events$.asObservable();
    }

    /**
     * Crea un nuevo evento
     * @param eventData Datos completos del evento (ya validados)
     * @param userId ID del usuario autenticado
     * @returns Observable que emite el evento creado
     */

    createEvent(eventData: EventFormDTO, userId: string): Observable<Event> {
        // logica para validar datos
        // crear ID único
        // guardar en supabase
        // subir imagen a supabase Storage
        // emitir evento creado
    
    console.log('Evento creado de',userId);
    return new Observable(observer => {
        observer.next({} as Event);   
    })
    }

    getEventsByUser(userId: string): Observable<Event[]> {
        // Consulta a Supabase: SELECT * FROM events WHERE userId = ?
        return new Observable(observer => {
            observer.next([]);
        })
    }

    updateEvent(eventId: String, updates: Partial<Event>): Observable<Event> {
        // UPDATE events SER... WHERE is = ?
        return new Observable(observer => {
            observer.next({} as Event);
        })
    }

    deleteEvent(eventId: String): Observable<void> {
        // DELETE FROM events WHERE id = ?
        return new Observable(observer => {
            observer.next();
        })
    }

    
}