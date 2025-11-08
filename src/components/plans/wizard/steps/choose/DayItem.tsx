import MealChooser from "../../../../dialog/MealChooser.tsx";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, CardMedia, Stack, Typography, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Plan from "../../../../../domain/Plan.ts";
import {usePlanCreate} from "../../../../../hooks/plan/usePlanCreate.ts";
import {usePlanUpdate} from "../../../../../hooks/plan/usePlanUpdate.ts";
import Meal from "../../../../../domain/Meal.ts";
import PlanMeal from "../../../../../domain/PlanMeal.ts";
import {useState} from "react";
import {usePlanDelete} from "../../../../../hooks/plan/usePlanDelete.ts";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import CalendarEvents from "./CalendarEvents.tsx";
import ServesChip from "../../../../meals/chip/ServesChip.tsx";
import EffortChip from "../../../../meals/chip/EffortChip.tsx";
import PrepTimeChip from "../../../../meals/chip/PrepTimeChip.tsx";
import IngredientsWarningChip from "../../../../meals/chip/IngredientsWarningChip.tsx";
import {NotesRounded, Kitchen} from "@mui/icons-material";

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
        deletePlan(plan, () => setMealPlan(new MealPlan([...MealPlan.filterOutPlan(mealPlan.plans, plan), {date: plan.date, planMeals: [], shoppingListItems: []}])));
    }

    const Note = ({note}: {note: string}) => {
        return (
            <Stack direction='row' gap={1}>
                <NotesRounded/>
                <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{
                        fontWeight: 'bold',
                        px: 0.5,
                    }}
                >
                    {note}
                </Typography>
            </Stack>
        )
    }

    const MealComponent = ({planMeal, setMealChooserOpen} : {planMeal: PlanMeal, setMealChooserOpen : (open: boolean) => void}) => {
        const meal = planMeal.meal;
        const hasIngredients = !meal || meal.ingredients?.length > 0;

        return (
            <Stack>
                {planMeal.note && <Typography  sx={{color: 'text.secondary', mb: 0, mt: 0.5, fontWeight: 'bold'}}>{planMeal.note}</Typography>}

                <Card onClick={() => setMealChooserOpen(true)} sx={{backgroundColor: hasIngredients ? 'secondaryContainer' : 'warningContainer', my: 0.3}}>
                    <Stack direction="row" gap={1} sx={{padding: 1}}>
                        {planMeal.leftovers ? (
                            <Box
                                sx={{
                                    width: constant.imageWidth,
                                    height: constant.imageHeight,
                                    borderRadius: constant.imageBorderRadius,
                                    flexShrink: 0,
                                    backgroundColor: 'tertiary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Kitchen sx={{ fontSize: 20, color: 'onPrimary' }} />
                            </Box>
                        ) : meal?.image?.url ? (
                            <CardMedia
                                sx={{
                                    width: constant.imageWidth,
                                    height: constant.imageHeight,
                                    borderRadius: constant.imageBorderRadius,
                                    flexShrink: 0,
                                    backgroundSize: 'cover'
                                }}
                                image={meal.image.url}
                            />
                        ) : null}
                        <Typography noWrap={true} sx={{cursor: 'pointer', fontWeight: 500, alignContent: 'center' }}
                                    onClick={(e) => { e.stopPropagation(); navigate(`/meals/${meal.id}`); }}>
                            {meal?.name}{planMeal.leftovers ? ' Leftovers' : ''}
                        </Typography>

                        <Box flexGrow={1} />

                        <Box sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center',
                            mt: 0.2,
                            flexWrap: 'wrap'
                        }}>
                            <IngredientsWarningChip meal={meal} size="small" />
                            <EffortChip effort={meal?.effort} size="small" />
                            <ServesChip serves={planMeal.requiredServings} size="small" />
                            <PrepTimeChip prepTimeMinutes={meal?.prepTimeMinutes} size="small" />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        );
    }


    return (
        <motion.tr layout key={index} style={{borderBottom: '1px solid #e0e0e0', borderRadius: 5, verticalAlign: 'middle'}}
                   whileHover={{scale: 1.01, opacity: 0.8, cursor: 'pointer'}} onClick={onClick}>
            <MealChooser meals={meals}
                         mealsLoading={mealsLoading}
                         mealsFailed={mealsFailed}
                         open={mealChooserOpen}
                         setOpen={setMealChooserOpen}
                         onConfirm={(meal) => {
                             const newPlanMeal: PlanMeal = { meal, requiredServings: meal.serves };
                             const newPlan = {...plan, planMeals: [...(plan.planMeals || []), newPlanMeal]}
                             if (newPlan.id == null) {
                                 createPlan(newPlan, (returnedPlan) =>
                                     setMealPlan(new MealPlan([...MealPlan.filterOutPlan(mealPlan.plans, plan), returnedPlan]))
                                 )
                             } else {
                                 updatePlan(newPlan, ()=> console.log("Updated plan"))
                                 setMealPlan(new MealPlan([...MealPlan.filterOutPlan(mealPlan.plans, plan), newPlan]))
                             }
                         }}
            />
            <motion.td layout style={{paddingRight: '0.3rem'}}>
                <Typography component={motion.div} layout variant='h6' align="center" sx={{
                    backgroundColor: isToday(plan) ? primary : 'transparent',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999999px',
                    my: 0.5,
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
                    {plan.note && (
                        <Note note={plan.note}/>
                    )}
                    {
                        plan.planMeals?.map((planMeal, i) =>
                            <MealComponent key={i} planMeal={planMeal} setMealChooserOpen={setMealChooserOpen}/>
                        ) || []
                    }
                </Box>
            </motion.td>
            <motion.td layout>
                <CalendarEvents calendarEvents={calendarEvents} />
            </motion.td>
        </motion.tr>
    )


}
