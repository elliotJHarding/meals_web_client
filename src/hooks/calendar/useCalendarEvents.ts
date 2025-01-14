import {useEffect, useState} from "react";
import CalendarRepository from "../../repository/CalendarRepository.ts";
import CalendarEvent from "../../domain/CalendarEvent.ts";

export const useCalendarEvents = () => {
    const repository : CalendarRepository = new CalendarRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        repository.getEvents((events: CalendarEvent[]) => {
            setCalendarEvents(events);
            setLoading(false)
        });
    }, []);

    return {calendarEvents, loading};
}