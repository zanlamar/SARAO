export interface CalendarDay {
    day: number;
    month: number;
    year: number;
    dateString: string;
    isToday: boolean;
    isCurrentMonth: boolean;
    dayOfWeek: number;
}