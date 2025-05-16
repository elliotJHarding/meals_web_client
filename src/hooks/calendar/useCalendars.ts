import {useEffect, useState} from "react";
import CalendarRepository from "../../repository/CalendarRepository.ts";
import Calendar from "../../domain/Calendar.ts";

export const useCalendars = () => {
    const repository : CalendarRepository = new CalendarRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    const updateActiveCalendars = (calendarIds : string[]) => {
        repository.updateActiveCalendars(calendarIds, () => console.log("Updated active calendars"))
    }

    useEffect(() => {
        repository.getCalendars((events: Calendar[]) => {
            setCalendars(events);
            setLoading(false)
        });
    }, []);

    return {calendars, setCalendars, loading, updateActiveCalendars};
}