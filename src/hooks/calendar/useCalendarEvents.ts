import {useEffect, useState} from "react";
import CalendarRepository from "../../repository/CalendarRepository.ts";
import CalendarEvent from "../../domain/CalendarEvent.ts";
import { useCalendarEventsCache } from "../../contexts/CalendarEventsCacheContext.tsx";

export const useCalendarEvents = (from : string, to : string, ttlMs?: number) => {
    const repository : CalendarRepository = new CalendarRepository();
    const { 
        getCachedEvents, 
        setCachedEvents, 
        hasCachedEvents, 
        getCachedAuthStatus 
    } = useCalendarEventsCache();

    const [loading, setLoading] = useState<boolean>(!hasCachedEvents(from, to, ttlMs));
    const [isAuthorized, setIsAuthorized] = useState<boolean>(getCachedAuthStatus(from, to) ?? true);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(getCachedEvents(from, to) ?? []);

    useEffect(() => {
        // If we have valid cached data, use it immediately
        if (hasCachedEvents(from, to, ttlMs)) {
            const cached = getCachedEvents(from, to);
            const cachedAuthStatus = getCachedAuthStatus(from, to);
            
            if (cached && cachedAuthStatus !== null) {
                setCalendarEvents(cached);
                setIsAuthorized(cachedAuthStatus);
                setLoading(false);
                return;
            }
        }

        // Cache is expired or doesn't exist, fetch fresh data
        repository.isAuthorized(authorized => {
            setIsAuthorized(authorized);
            
            if (authorized) {
                repository.getEvents(from, to, (events: CalendarEvent[]) => {
                    const processedEvents = events.map(event => ({ 
                        ...event, 
                        time: new Date(Date.parse(event.time as unknown as string)) 
                    } as CalendarEvent));
                    
                    setCalendarEvents(processedEvents);
                    setCachedEvents(from, to, processedEvents, authorized);
                    setLoading(false);
                });
            } else {
                // Cache the unauthorized status
                setCachedEvents(from, to, [], authorized);
                setLoading(false);
            }
        });
    }, [from, to, ttlMs]);

    return {calendarEvents, isAuthorized, loading};
}