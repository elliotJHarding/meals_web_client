import {Card, CardMedia, Stack, Typography, useTheme} from "@mui/material";
import MealPlan from "../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import Plan from "../../../domain/Plan.ts";
import Button from "@mui/material-next/Button";
import {Add, Edit} from "@mui/icons-material";
import {useState} from "react";
import MealChooser from "../../dialog/MealChooser.tsx";
import Meal from "../../../domain/Meal.ts";
import IconButton from "@mui/material/IconButton";
import {usePlanCreate} from "../../../hooks/plan/usePlanCreate.ts";
import {usePlanUpdate} from "../../../hooks/plan/usePlanUpdate.ts";

const constant = {
    imageWidth: 50,
    imageHeight: 50,
    imageBorderRadius: 2,
}

export default function ChooseMeals({mealPlan, setMealPlan, meals, mealsLoading, mealsFailed}: {
    mealPlan: MealPlan,
    setMealPlan: (mealPlan: MealPlan) => void,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean
}) {

    const theme = useTheme();
    const {createPlan} = usePlanCreate();
    const {updatePlan} = usePlanUpdate();

    const isToday = (plan: Plan) : boolean => {
        let today: Date = new Date();
        return (
            today.getFullYear() === plan.date.getFullYear() &&
            today.getMonth() === plan.date.getMonth() &&
            today.getDate() === plan.date.getDate()
        )
    }

    const meal = (meal: Meal | undefined, setMealChooserOpen : (open: boolean) => void) =>
        <Stack direction='row' gap={1} alignItems='center'>
            <CardMedia
                sx={{width: constant.imageWidth, height: constant.imageHeight, borderRadius: constant.imageBorderRadius}}
                image={meal?.image?.url}
            />
            <Typography variant='h6'>
                {meal?.name}
            </Typography>
            <Box sx={{flexGrow: 1}}/>
            <IconButton onClick={() => setMealChooserOpen(true)}>
                 <Edit/>
            </IconButton>
        </Stack>

    const addMealButton = (onClick : () => void) =>
        <Button sx={{borderRadius: 2, width: '100%'}} startIcon={<Add/>} onClick={onClick} >Add</Button>

    const dayItems = mealPlan.plans.map((plan, i) => {
        const [mealChooserOpen, setMealChooserOpen] = useState<boolean>(false);
        return (
            <tr key={i}>
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
                        backgroundColor: isToday(plan) ? theme.sys.color.primary : 'transparent',
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999999px',
                        color: isToday(plan) ? 'white' : 'textSecondary'
                    }}>
                        {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                    </Typography>
                </td>
                <td>
                    <Typography color={isToday(plan) ? theme.sys.color.primary : 'textSecondary'}>
                        {plan.date.toLocaleDateString('en-gb', {weekday: 'short'})}
                    </Typography>
                </td>
                <td>
                    <Card>
                        <Box sx={{padding: 1}}>
                            {plan.dinner !== null ?
                                meal(plan.dinner, setMealChooserOpen) :
                                addMealButton(() => setMealChooserOpen(true))}
                        </Box>
                    </Card>
                </td>
            </tr>
        )
    });

    return (
        <>
            <Stack spacing={2} sx={{paddingLeft: 2}}>
                <Typography variant='h6'>
                    {`${mealPlan.plans[0].date.toLocaleDateString('en-gb', {
                        day: "numeric",
                        month: "long"
                    })} - ${mealPlan.plans[mealPlan.plans.length - 1].date.toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                </Typography>
            </Stack>
            <Card>
                <Box sx={{padding: 2}}>
                    <table>
                        <tbody>
                            {dayItems}
                        </tbody>
                    </table>
                </Box>
            </Card>
        </>
    );
}
