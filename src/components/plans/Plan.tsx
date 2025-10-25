import Plan from "../../domain/Plan.ts";
import {Card, CardMedia, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Meal from "../../domain/Meal.ts";
import {RestaurantMenu} from "@mui/icons-material";

export default function DayPlan({plan} : {plan: Plan}) {

    const MealItems = ({meals}: {meals: Meal[]}) => meals.map(meal => {
        const hasIngredients = !meal || meal.ingredients?.length > 0;

        return (
            <Card key={meal?.id || Math.random()} sx={{backgroundColor: hasIngredients ? 'secondaryContainer' : 'warningContainer'}}>
                <Box sx={{padding: 1}}>
                <Stack direction='row' gap={1}>
                    {meal?.image?.url ? (
                        <CardMedia
                            image={meal.image.url}
                            sx={{
                                borderRadius: 2,
                                width: 50,
                                height: 50,
                                backgroundSize: 'cover'
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                borderRadius: 2,
                                width: 50,
                                height: 50,
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <RestaurantMenu sx={{ fontSize: 24, color: 'grey.400' }} />
                        </Box>
                    )}
                    <Typography variant='h6'>
                        {meal?.name || 'Unknown Meal'}
                    </Typography>
                </Stack>
            </Box>
        </Card>
        );
    });

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