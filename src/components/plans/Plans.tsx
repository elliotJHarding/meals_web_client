import {usePlans} from "../../hooks/plan/usePlans.ts";
import MealPlan from "../../domain/MealPlan.ts";
import WeekPlan from "./WeekPlan.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import {Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {Edit} from "@mui/icons-material";
import Button from "@mui/material-next/Button";

export default function Plans() {

    const getLastStartOfWeek = () => {
        let date = new Date();
        date.setDate(today.getDate() - dayDifference);
        return date;
    }

    const getNextStartOfWeek = () => {
        let date = new Date();
        date.setDate(lastStartOfWeek.getDate() + 7);
        return date;
    }

    const getEndOfWeek = (startOfWeek: Date) => {
        let date = new Date();
        date.setDate(startOfWeek.getDate() + 6);
        return date;
    }

    const startOfWeek = 1;

    const today = new Date();
    const delta = today.getDay() - startOfWeek;
    const dayDifference = delta < 0 ? delta + 7 : delta;
    const lastStartOfWeek = getLastStartOfWeek();
    const nextStartOfWeek = getNextStartOfWeek();

    const thisWeek = usePlans(
        lastStartOfWeek,
        getEndOfWeek(lastStartOfWeek),
    );

    const nextWeek = usePlans(
        nextStartOfWeek,
        getEndOfWeek(nextStartOfWeek),
    );

    return (
        <Grid container spacing={2} sx={{minHeight: '60vh'}}>
            <Grid xs={12} md={6}>
                <Stack direction='row' spacing={2} alignItems="center">
                    <Typography variant='h6'>
                        This Week
                    </Typography>
                    <Typography sx={{opacity: 0.5}}>
                        {`${lastStartOfWeek.toLocaleDateString('en-gb', {day: "numeric", month: "long"})} - ${getEndOfWeek(lastStartOfWeek).toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                    </Typography>
                </Stack>
                <WeekPlan mealPlan={new MealPlan(thisWeek.plans)}/>
            </Grid>
            <Grid xs={12} md={6}>
                <Stack direction='row' spacing={2} alignItems="center">
                    <Typography variant='h6'>
                        Next Week
                    </Typography>
                    <Typography sx={{opacity: 0.5}}>
                        {`${nextStartOfWeek.toLocaleDateString('en-gb', {day: "numeric", month: "long"})} - ${getEndOfWeek(nextStartOfWeek).toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                    </Typography>
                </Stack>
                <WeekPlan mealPlan={new MealPlan(nextWeek.plans)}/>
            </Grid>
        </Grid>
    )
}
