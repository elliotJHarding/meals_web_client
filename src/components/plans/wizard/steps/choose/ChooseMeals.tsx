import {Card, Stack} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import Meal from "../../../../../domain/Meal.ts";
import {motion} from "framer-motion";
import DayItem from "./DayItem.tsx";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import Plan from "../../../../../domain/Plan.ts";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import {CalendarMonth} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {useLinkCalendar} from "../../../../../hooks/calendar/useLinkCalendar.ts";

export default function ChooseMeals({mealPlan, from, to, setMealPlan, meals, mealsLoading, mealsFailed}: {
    mealPlan: MealPlan,
    from: string,
    to: string,
    setMealPlan: (mealPlan: MealPlan) => void,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const {calendarEvents, isAuthorized} = useCalendarEvents(from, to);
    const {authorizeCalendar} = useLinkCalendar();

    const filterEventsByPlan = (events: CalendarEvent[], plan: Plan) : CalendarEvent[] => {
        return events.filter(event =>
            event.time !== null && plan.date !== null &&
            event.time.getDate() === plan.date.getDate() &&
            event.time.getMonth() === plan.date.getMonth() &&
            event.time.getFullYear() === plan.date.getFullYear()
        );
    }

    const LinkCalendarButton = () =>
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{width: '40%'}}>
            <Button variant='outlined' size='large' sx={{borderRadius: 3, padding: 4, width: '100%', height: '100%', margin: 3}} startIcon={<CalendarMonth/>} onClick={authorizeCalendar}>Link Calendar</Button>
        </Stack>

    const dayItems = mealPlan.plans.map((plan, i) =>
        <DayItem index={i}
                 plan={plan}
                 meals={meals}
                 mealsLoading={mealsLoading}
                 mealsFailed={mealsFailed}
                 mealPlan={mealPlan}
                 setMealPlan={setMealPlan}
                 calendarEvents={filterEventsByPlan(calendarEvents, plan)}/>
    );

    return (
        <Card component={motion.div}
              layout
              initial={{x:100, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: 100, opacity: 0 }}>
            <Stack direction="row" spacing={2} sx={{padding: 2}}>
                <Box sx={{width: !isAuthorized ? '60%' : '100%'}}>
                    <table style={{width:'100%', borderCollapse: 'collapse'}}>
                        <tbody>
                        {dayItems}
                        </tbody>
                    </table>
                </Box>
                {!isAuthorized && <LinkCalendarButton/>}
            </Stack>
        </Card>
    );
}
