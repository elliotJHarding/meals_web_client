import MealChooser from "../../../../dialog/MealChooser.tsx";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, CardMedia, Stack, Typography, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Plan from "../../../../../domain/Plan.ts";
import {usePlanCreate} from "../../../../../hooks/plan/usePlanCreate.ts";
import {usePlanUpdate} from "../../../../../hooks/plan/usePlanUpdate.ts";
import Meal from "../../../../../domain/Meal.ts";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import {Add, Close, Edit, NoteAdd, Restaurant} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {usePlanDelete} from "../../../../../hooks/plan/usePlanDelete.ts";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";

const constant = {
    imageWidth: 50,
    imageHeight: 50,
    imageBorderRadius: 2,
}

export default function DayItem({index, plan, meals, mealsLoading, mealsFailed, mealPlan, setMealPlan, calendarEvents}: {
    index: number,
    plan: Plan,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
    mealPlan: MealPlan,
    setMealPlan: (mealPlan: MealPlan) => void,
    calendarEvents: CalendarEvent[]
}) {
    const [mealChooserOpen, setMealChooserOpen] = useState<boolean>(false);
    const {createPlan} = usePlanCreate();
    const {updatePlan} = usePlanUpdate();
    const {deletePlan} = usePlanDelete();

    const navigate = useNavigate();

    const theme = useTheme();
    // @ts-ignore
    const primary = theme.sys.color.primary;

    const isToday = (plan: Plan) : boolean => {
        const today: Date = new Date();
        return (
            today.getFullYear() === plan.date.getFullYear() &&
            today.getMonth() === plan.date.getMonth() &&
            today.getDate() === plan.date.getDate()
        )
    }

    const onDelete = () => {
        deletePlan(plan, () => setMealPlan(new MealPlan(mealPlan.plans.filter(p => p.id != plan.id))));
    }

    const Meal = ({meal, setMealChooserOpen} : {meal: Meal, setMealChooserOpen : (open: boolean) => void}) =>
        <Stack direction='row' gap={1} alignItems='center' >
            <CardMedia
                sx={{width: constant.imageWidth, height: constant.imageHeight, borderRadius: constant.imageBorderRadius}}
                image={meal?.image?.url}
            />
            <Typography variant='h6' sx={{cursor: 'pointer'}} onClick={() => navigate(`/meals/${meal.id}`)}>
                {meal?.name}
            </Typography>
            <Box sx={{flexGrow: 1}}/>
            <IconButton onClick={() => setMealChooserOpen(true)}>
                <Edit/>
            </IconButton>
            <IconButton onClick={onDelete}>
                <Close/>
            </IconButton>
        </Stack>

    const AddActions = () => {
        const [showActions, setShowActions] = useState<boolean>(false);
        const onMouseEnter = () => setShowActions(true);
        const onMouseLeave = () => setShowActions(false);

        const actions =
            <>
                <AddMealButton onClick={() => setMealChooserOpen(true)}/>
                <Button sx={{borderRadius: 2}} startIcon={<NoteAdd/>}>Note</Button>
            </>

        const add =
            <IconButton><Add/></IconButton>

        return (
            <Stack direction='row' justifyContent='space-evenly' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} component={motion.div} layout>
                {showActions ? actions : add}
            </Stack>
        )
    }

    const AddMealButton = ({onClick} : {onClick : () => void}) =>
        <Button sx={{borderRadius: 2}} startIcon={<Restaurant/>} onClick={onClick} >Meal</Button>

    const calendarEventItems = calendarEvents.map(event =>
        <Card>
            <Typography variant='h6'>{event.time.getHours() + ":" + event.time.getMinutes()}</Typography>
            <Typography variant='h6'>{event.name}</Typography>
        </Card>
    )

    return (
        <tr key={index}>
            <MealChooser meals={meals}
                         mealsLoading={mealsLoading}
                         mealsFailed={mealsFailed}
                         open={mealChooserOpen}
                         setOpen={setMealChooserOpen}
                         onConfirm={(meal) => {
                             const newPlan = {...plan, dinner: meal}
                             if (newPlan.id == null) {
                                 createPlan(newPlan, (returnedPlan) =>
                                     setMealPlan(new MealPlan([...mealPlan.plans.filter(p => p.date !== plan.date), returnedPlan]))
                                 )
                             } else {
                                 updatePlan(newPlan, ()=> console.log("Updated plan"))
                                 setMealPlan(new MealPlan([...mealPlan.plans.filter(p => p.date !== plan.date), newPlan]))
                             }
                         }}
            />
            <td style={{paddingRight: '0.1rem'}}>
                <Typography variant='h6' align="center" sx={{
                    backgroundColor: isToday(plan) ? primary : 'transparent',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999999px',
                    color: isToday(plan) ? 'white' : 'textSecondary',
                }}>
                    {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                </Typography>
            </td>
            <td style={{paddingRight: '0.4rem'}}>
                <Typography color={isToday(plan) ? primary : 'textSecondary'}
                            sx={{fontFamily: 'Montserrat'}}>
                    {plan.date.toLocaleDateString('en-gb', {weekday: 'short'})}
                </Typography>
            </td>
            <td>
                <Card component={motion.div} layout>
                    <Box sx={{padding: 1}} component={motion.div} layout>
                        {
                            plan.dinner != null ?
                            <Meal meal={plan.dinner} setMealChooserOpen={setMealChooserOpen}/> :
                            <AddActions/>
                        }
                    </Box>
                </Card>
            </td>
            <td>
                {calendarEventItems}
            </td>
        </tr>
    )


}