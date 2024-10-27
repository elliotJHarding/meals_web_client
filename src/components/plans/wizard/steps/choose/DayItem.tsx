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
import {Add, Close, Edit} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {usePlanDelete} from "../../../../../hooks/plan/usePlanDelete.ts";
import {useNavigate} from "react-router-dom";

const constant = {
    imageWidth: 50,
    imageHeight: 50,
    imageBorderRadius: 2,
}

export default function DayItem({index, plan, meals, mealsLoading, mealsFailed, mealPlan, setMealPlan}: {
    index: number,
    plan: Plan,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
    mealPlan: MealPlan,
    setMealPlan: (mealPlan: MealPlan) => void
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
        let today: Date = new Date();
        return (
            today.getFullYear() === plan.date.getFullYear() &&
            today.getMonth() === plan.date.getMonth() &&
            today.getDate() === plan.date.getDate()
        )
    }

    const onDelete = () => {
        deletePlan(plan, () => setMealPlan(new MealPlan(mealPlan.plans.filter(p => p.id != plan.id))));
    }

    const meal = (meal: Meal, setMealChooserOpen : (open: boolean) => void) =>
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

    const addMealButton = (onClick : () => void) =>
        <Button sx={{borderRadius: 2, width: '100%'}} startIcon={<Add/>} onClick={onClick} >Add</Button>

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
            <td style={{paddingRight: '0.4rem'}}>
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
            <td>
                <Typography color={isToday(plan) ? primary : 'textSecondary'}
                            sx={{fontFamily: 'Montserrat'}}>
                    {plan.date.toLocaleDateString('en-gb', {weekday: 'short'})}
                </Typography>
            </td>
            <td>
                <Card>
                    <Box sx={{padding: 1}}>
                        {plan.dinner != null ?
                            meal(plan.dinner, setMealChooserOpen) :
                            addMealButton(() => setMealChooserOpen(true))}
                    </Box>
                </Card>
            </td>
        </tr>
    )


}