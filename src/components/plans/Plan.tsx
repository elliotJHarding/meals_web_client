import Plan from "../../domain/Plan.ts";
import {Card, CardMedia, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Meal from "../../domain/Meal.ts";

export default function DayPlan({plan} : {plan: Plan}) {

    const MealItems = ({meals}: {meals: Meal[]}) => meals.map(meal =>
        <Card key={meal?.id || Math.random()}>
            <Box sx={{padding: 1}}>
                <Stack direction='row' gap={1}>
                    <CardMedia 
                        image={meal?.image?.url || '/placeholder-meal.png'} 
                        sx={{
                            borderRadius: 2, 
                            width: 50, 
                            height: 50,
                            backgroundColor: meal?.image?.url ? 'transparent' : 'grey.200',
                            backgroundSize: 'cover'
                        }}
                    />
                    <Typography variant='h6'>
                        {meal?.name || 'Unknown Meal'}
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
                <MealItems meals={plan.planMeals?.map(pm => pm.meal).filter(meal => meal != null) || []}/>
            </Stack>
        </Stack>
    )

}