import {CalendarApi, CalendarEventDto, Calendar, Configuration} from "@elliotJHarding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import {axiosInstance} from "./Client.ts";

export default class CalendarRepository {
    private api: CalendarApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        this.api = new CalendarApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    public getCalendars(onSuccess: (calendars: Calendar[]) => void): void {
        console.info(`Fetching calendars`);

        this.api.getAllCalendars()
            .then(response => {
                console.info('Successfully fetched calendars');
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                // Suppress toast for calendar errors (as original code did)
            });
    }

    public getEvents(from: string, to: string, onSuccess: (events: CalendarEventDto[]) => void): void {
        console.info(`Fetching calendar events from ${from} to ${to}`);

        this.api.getCalendarEvents(from, to)
            .then(response => {
                console.info('Successfully fetched calendar events');
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                // Suppress toast for calendar errors (as original code did)
            });
    }

    public isAuthorized(onSuccess: (isAuthorized: boolean) => void): void {
        console.info(`Checking if calendar is authorized`);

        this.api.isCalendarAuthorized()
            .then(response => {
                console.info('Successfully checked if calendar is authorized');
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to check calendar authorization');
            });
    }

    public authorizeCalendar(onSuccess: (url: string) => void): void {
        console.info(`Getting authorization url for calendar`);

        this.api.getCalendarAuthUrl()
            .then(response => {
                console.info('Successfully fetched calendar authorization url');
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to get calendar authorization URL');
            });
    }

    public linkCalendar(token: string, onSuccess: () => void): void {
        console.info(`Linking calendar after successful authorization`);

        this.api.linkCalendar(decodeURI(token))
            .then(() => {
                console.info("Successfully linked calendar");
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to link calendar');
            });
    }

    public updateActiveCalendars(calendarIds: string[], onSuccess: () => void): void {
        console.info(`Updating active calendars`);

        this.api.updateActiveCalendars(calendarIds)
            .then(() => {
                console.info("Successfully updated active calendars");
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to update active calendars');
            });
    }
}