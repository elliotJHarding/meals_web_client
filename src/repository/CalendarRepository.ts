import ResourceRepository from "./ResourceRepository.ts";
import CalendarEvent from "../domain/CalendarEvent.ts";
import Calendar from "../domain/Calendar.ts";

export default class CalendarRepository extends ResourceRepository {

    public getCalendars(onSuccess : (events : Calendar[]) => void) : void {
        console.info(`Fetching calendar events`)
        this.get('calendar', (response) => {
            onSuccess(response.data);
            console.info('Successfully fetched calendar events');
            console.info(response.data);
        }, () => null, true);
    }
    public getEvents(from: string, to: string, onSuccess : (events : CalendarEvent[]) => void) : void {
        console.info(`Fetching calendar events`)
        this.get(`calendar/events/${from}/${to}`, (response) => {
            onSuccess(response.data);
            console.info('Successfully fetched calendar events');
            console.info(response.data);
        }, () => null, true);
    }
    public isAuthorized(onSuccess : (isAuthorized : boolean) => void) : void {
        console.info(`Checking if calendar is authorized`)
        this.get(`calendar/authorized`, (response) => {
            onSuccess(response.data);
            console.info('Successfully checked if calendar is authorized');
            console.info(response.data);
        });
    }

    public authorizeCalendar(onSuccess : (url: string) => void) : void {
        console.info(`Getting authorization url for calendar`)
        this.get('calendar/authorize', (response) => {
            console.info('Successfully fetched calendar authorization url');
            console.info(response.data);
            onSuccess(response.data)
        })
    }

    public linkCalendar(token: string, onSuccess : () => void) : void {
        console.info(`Linking calendar after successful authorization`)
        this.post('calendar/link', decodeURI(token), () => {
            console.info("Successfully linked calendar")
            onSuccess()
        });
    }

    public updateActiveCalendars(calendarIds: string[], onSuccess : () => void) : void {
        console.info(`Updating active calendars`)
        this.post('calendar/active', calendarIds, () => {
            console.info("Successfully updated active calendars")
            onSuccess()
        })
    }

}