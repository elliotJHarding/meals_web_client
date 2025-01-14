import ResourceRepository from "./ResourceRepository.ts";
import CalendarEvent from "../domain/CalendarEvent.ts";

export default class CalendarRepository extends ResourceRepository {
    public getEvents(onSuccess : (events : CalendarEvent[]) => void) : void {
        console.info(`Fetching calendar events`)
        this.get('calendar/events', (response) => {
            onSuccess(response.data);
            console.info('Successfully fetched calendar events');
            console.info(response.data);
        });
    }
}