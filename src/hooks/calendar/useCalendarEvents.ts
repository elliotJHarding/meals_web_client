import {useEffect, useState} from "react";
import CalendarRepository from "../../repository/CalendarRepository.ts";
import CalendarEvent from "../../domain/CalendarEvent.ts";

export const useCalendarEvents = (from : string, to : string) => {
    const repository : CalendarRepository = new CalendarRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        repository.isAuthorized(isAuthorized =>{
            setIsAuthorized(isAuthorized);
            if (isAuthorized) {
                repository.getEvents(from, to, (events: CalendarEvent[]) => {
                    setCalendarEvents(events.map(event => { return {...event, time: new Date(Date.parse(event.time as unknown as string))} as CalendarEvent}));
                    setLoading(false)
                });
            }
        })
    }, []);

    return {calendarEvents, isAuthorized, loading};
}