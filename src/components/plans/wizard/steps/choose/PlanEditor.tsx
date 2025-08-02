import Plan from "../../../../../domain/Plan.ts";
import {Box, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {useNavigate} from "react-router-dom";
import {ArrowBackIos, Edit, EditNote, EditNoteRounded, Note, Search} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import Grid from "@mui/material/Unstable_Grid2";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import CalendarEvents from "./CalendarEvents.tsx";

interface PlanEditorProps {
    plan: Plan
}

export default function PlanEditor({plan}: PlanEditorProps) {

    const navigate = useNavigate();

    const {calendarEvents} = useCalendarEvents(MealPlan.formatDate(plan.date), MealPlan.formatDate(plan.date))

    return (
        <Box padding={2} component={motion.div} layout width={'100%'}>
            <Stack direction="row" spacing={2} alignItems={'center'} width={'100%'}>
                <Button variant={'text'} size={'medium'} sx={{borderRadius: 2, paddingX: 1, paddingY: 1}} startIcon={<ArrowBackIos/>}
                        onClick={() => navigate(-1)} component={motion.div} layout>

                    <Typography id={`day-number-${MealPlan.formatDate(plan.date)}`} component={motion.div} layout
                                variant='h6' align="center" sx={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999999px',
                        marginRight: 0.5
                    }}
                    >
                        {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                    </Typography>
                    <Typography
                        id={`day-${MealPlan.formatDate(plan.date)}`}
                        sx={{fontFamily: 'Montserrat'}} component={motion.div} layout>
                        {plan.date.toLocaleDateString('en-gb', {weekday: 'long'})}
                    </Typography>
                </Button>
                <TextField size={'small'} InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <EditNoteRounded/>
                        </InputAdornment>
                    ),
                    placeholder: 'Add a note',
                    sx: {borderRadius: 999999, width: 400}
                }}/>
            </Stack>
            <Grid container spacing={1}>
                <Grid xs={3}>
                    <Typography>Meals</Typography>
                </Grid>
                <Grid xs={6}>

                </Grid>
                <Grid xs={3}>
                    <CalendarEvents calendarEvents={calendarEvents} />
                </Grid>
            </Grid>
        </Box>
    );
}