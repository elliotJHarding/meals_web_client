import MealChooser from "../../../../dialog/MealChooser.tsx";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, CardMedia, Stack, Typography, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Plan from "../../../../../domain/Plan.ts";
import {usePlanCreate} from "../../../../../hooks/plan/usePlanCreate.ts";
import {usePlanUpdate} from "../../../../../hooks/plan/usePlanUpdate.ts";
import Meal from "../../../../../domain/Meal.ts";
import {useState} from "react";
import {usePlanDelete} from "../../../../../hooks/plan/usePlanDelete.ts";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import CalendarEvents from "./CalendarEvents.tsx";

const constant = {
    imageWidth: 30,
    imageHeight: 25,
    imageBorderRadius: 2,
}

interface DayItemProps {
    index: number,
    plan: Plan,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
    mealPlan: MealPlan,
    setMealPlan: (mealPlan: MealPlan) => void,
    calendarEvents: CalendarEvent[],
}

export default function DayItem({index, plan, meals, mealsLoading, mealsFailed, mealPlan, setMealPlan, calendarEvents}: DayItemProps) {
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

    const onClick = () => navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}&selected=${MealPlan.formatDate(plan.date)}`)

    const onDelete = () => {
        deletePlan(plan, () => setMealPlan(new MealPlan([...mealPlan.plans.filter(p => p.id != plan.id), {date: plan.date, meals: [], shoppingListItems: []}])));
    }

    const Meal = ({meal, setMealChooserOpen} : {meal: Meal, setMealChooserOpen : (open: boolean) => void}) =>
        <Card onClick={() => setMealChooserOpen(true)} sx={{margin: 1, backgroundColor: 'beige'}}>
            <Stack direction="row" gap={1} sx={{padding: 1}}>
                <CardMedia
                    sx={{
                        width: constant.imageWidth,
                        height: constant.imageHeight,
                        borderRadius: constant.imageBorderRadius
                    }}
                    image={meal?.image?.url}
                />
                <Stack direction='row' gap={1} alignItems='center'>
                    <Typography noWrap={true} sx={{cursor: 'pointer'}}
                                onClick={() => navigate(`/meals/${meal.id}`)}>
                        {meal?.name}
                    </Typography>
                </Stack>
                {/*<Stack direction='row' gap={1} alignItems='center'>*/}
                {/*    <IconButton sx={{padding: 0.1}}>*/}
                {/*        <Remove/>*/}
                {/*    </IconButton>*/}
                {/*    <Person/>*/}
                {/*    <Typography>1</Typography>*/}
                {/*    <IconButton size={'small'} sx={{padding: 0.1, marginRight: 1}}>*/}
                {/*        <Add/>*/}
                {/*    </IconButton>*/}
                {/*    <IconButton size={'small'} onClick={() => setMealChooserOpen(true)} sx={{padding: 0.1}}>*/}
                {/*        <Edit/>*/}
                {/*    </IconButton>*/}
                {/*    <IconButton onClick={onDelete} sx={{padding: 0.1}}>*/}
                {/*        <Close/>*/}
                {/*    </IconButton>*/}
                {/*</Stack>*/}
        </Stack>
        </Card>


    return (
        <motion.tr layout key={index} style={{borderBottom: '1px solid #e0e0e0', borderRadius: 5}}
                   whileHover={{scale: 1.01, opacity: 0.8, cursor: 'pointer'}} onClick={onClick}>
            <MealChooser meals={meals}
                         mealsLoading={mealsLoading}
                         mealsFailed={mealsFailed}
                         open={mealChooserOpen}
                         setOpen={setMealChooserOpen}
                         onConfirm={(meal) => {
                             const newPlan = {...plan, meals: plan.meals.concat(meal)}
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
            <motion.td layout style={{paddingRight: '0.3rem'}}>
                <Typography component={motion.div} layout variant='h6' align="center" sx={{
                    backgroundColor: isToday(plan) ? primary : 'transparent',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999999px',
                    color: isToday(plan) ? 'white' : 'textSecondary',
                }}>
                    {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                </Typography>
            </motion.td>
            <motion.td layout style={{paddingRight: '0.6rem'}}>
                <Typography color={isToday(plan) ? primary : 'textSecondary'}
                            sx={{fontFamily: 'Montserrat'}} component={motion.div} layout>
                    {plan.date.toLocaleDateString('en-gb', {weekday: 'short'})}
                </Typography>
            </motion.td>
            <motion.td layout style={{width:'100%'}}>
                <Box sx={{padding: 0}} component={motion.div} layout>
                    {
                        plan.meals.map((meal, i) =>
                            <Meal key={i} meal={meal} setMealChooserOpen={setMealChooserOpen}/>
                        )
                    }
                </Box>
            </motion.td>
            <motion.td layout>
                <CalendarEvents calendarEvents={calendarEvents} />
            </motion.td>
        </motion.tr>
    )


}
