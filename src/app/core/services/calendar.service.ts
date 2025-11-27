import { Injectable } from '@angular/core';
import { CalendarDay } from '../models/calendar.model';
@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    constructor() {}

    generateCalendarDays(month: number, year: number): CalendarDay[] {
        const calendarDays: CalendarDay[] = [];
        const currentMonthDays = new Date(year, month + 1, 0).getDate();
        const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
        const firstWeekdayLundayFirst = (firstWeekdayOfMonth - 1 + 7) % 7;
        const previousMonthDays = new Date(year, month, 0).getDate();
        
        for (let i = firstWeekdayLundayFirst - 1; i >= 0; i--) {
            const day = previousMonthDays - i;
            const calendarDay = this.createCalendarDay(day, month - 1, year, false);
            calendarDays.push(calendarDay);
        }
        for (let day = 1; day <= currentMonthDays; day++) {
            const calendarDay = this.createCalendarDay(day, month, year, true);
            calendarDays.push(calendarDay);
        }
        const totalCells = 42;
        const nextMonthDays = totalCells - calendarDays.length;
        for (let day = 1; day <= nextMonthDays; day++) {
            const calendarDay = this.createCalendarDay(day, month + 1, year, false);
            calendarDays.push(calendarDay);
        }    
        return calendarDays;
}
    getMonthName(month: number): string {
    const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
    }   

    formatDateToString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    previousMonth(month: number, year: number): { month: number; year: number } {
        if (month === 0) { return { month: 11, year: year - 1 };
        } return { month: month - 1, year };
    }

    nextMonth(month: number, year: number): { month: number; year: number } {
        if (month === 11) { return { month: 0, year: year + 1 };
        } return { month: month + 1, year };
    }

    private createCalendarDay(day: number, month: number, year: number, isCurrentMonth: boolean): CalendarDay {
        const date = new Date(year, month, day);
        const dateString = this.formatDateToString(date);
        const isToday = this.isToday(date);
        const dayOfWeek = (date.getDay() - 1 + 7) % 7; 
        return {
            day,
            month: date.getMonth(),     
            year: date.getFullYear(),   
            dateString,
            isToday,
            isCurrentMonth,
            dayOfWeek
        };
    }
}

