import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import {Card, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";

interface CalendarEventsProps {
    calendarEvents: CalendarEvent[]
}

export default function CalendarEvents({calendarEvents}: CalendarEventsProps) {
    return (
        calendarEvents
            .sort((a, b) => {
                if (a.allDay && b.allDay) {
                    return 0
                }
                if (a.allDay && !b.allDay) {
                    return -1
                }
                if (!a.allDay && b.allDay) {
                    return 1
                }
                if (a.time === null || b.time === null) {
                    return 0;
                } else {
                    return a.time.getTime() - b.time.getTime();
                }
            })
            .map(event =>
                <Card variant={'outlined'} sx={{
                    paddingY: 0.3,
                    paddingX: 1,
                    borderRadius: 1,
                    margin: 1,
                    width: 250,
                    backgroundColor: event.colour
                }}
                      key={event.name}
                      component={motion.div} layout
                >
                    <Stack direction={'row'} gap={1} component={motion.div} layout>
                        {!event.allDay && <Typography component={motion.div} layout fontWeight={'bold'}
                                                      color={event.textColour}>{event.time.toLocaleTimeString('en-gb', {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        })}</Typography>}
                        <Typography component={motion.div} layout>{event.name}</Typography>
                    </Stack>
                </Card>
            )
    )
}