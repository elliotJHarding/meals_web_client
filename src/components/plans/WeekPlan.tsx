import {Card, Stack} from "@mui/material";
import MealPlan from "../../domain/MealPlan.ts";
import {PlanDto} from "@elliotJHarding/meals-api";
import DayPlan from "./Plan.tsx";
import Button from "@mui/material-next/Button";
import {NoteAdd} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useCalendarEvents} from "../../hooks/calendar/useCalendarEvents.ts";

export default function WeekPlan({mealPlan} : {mealPlan: MealPlan}) {

    const navigate = useNavigate();

    const planItems = mealPlan.plans
        .filter(plan => (plan.planMeals || []).length > 0)
        .map((plan: PlanDto, i) =>
            <DayPlan key={i} plan={plan}/>
        );

    const onClick = () => navigate(`create/choose?from=${mealPlan.from()}&to=${mealPlan.to()}`)

    useCalendarEvents(mealPlan.from(), mealPlan.to())

    const createPlan =
        <Button variant="text"
                size="large"
                startIcon={<NoteAdd/>}
                sx={{borderRadius: 3, height: '100%', width: '100%'}}
                onClick={onClick}
        >
            Create Plan
        </Button>

    const plan =
        <Button sx={{width: '100%', borderRadius: 2, justifyContent: 'start', padding: 1}}
                onClick={onClick}
        >
            <Stack gap={1} sx={{width: '100%'}}>
                {planItems}
            </Stack>
        </Button>

    return (
        <Card sx={{borderRadius: 3, padding: 2}}>
            {mealPlan.isEmpty() ? createPlan : plan}
        </Card>
    );
}