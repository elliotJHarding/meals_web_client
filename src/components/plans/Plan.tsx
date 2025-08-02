import Plan from "../../domain/Plan.ts";
import {Card, CardMedia, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Meal from "../../domain/Meal.ts";

export default function DayPlan({plan} : {plan: Plan}) {

    const MealItems = ({meals}: {meals: Meal[]}) => meals.map(meal =>
        <Card key={meal.id}>
            <Box sx={{padding: 1}}>
                <Stack direction='row' gap={1}>
                    <CardMedia image={meal.image?.url} sx={{borderRadius: 2, width: 50, height: 50}}/>
                    <Typography variant='h6'>
                        {meal.name}
                    </Typography>
                </Stack>
            </Box>
        </Card>
    );

    return (
        <Stack>
            <Typography fontWeight='bolder' textAlign='left'>
                {plan.date.toLocaleDateString('en-gb', {weekday: "long"})}
            </Typography>
            <Stack direction='row' gap={1}>
                <MealItems meals={plan.planMeals?.map(pm => pm.meal) || []}/>
            </Stack>
        </Stack>
    )

}