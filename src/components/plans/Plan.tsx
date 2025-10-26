import Plan from "../../domain/Plan.ts";
import {Card, CardMedia, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {RestaurantMenu, Kitchen} from "@mui/icons-material";
import PlanMeal from "../../domain/PlanMeal.ts";

export default function DayPlan({plan} : {plan: Plan}) {

    const MealItems = ({planMeals}: {planMeals: PlanMeal[]}) => planMeals.map((planMeal, index) => {
        const meal = planMeal.meal;
        const hasIngredients = !meal || meal.ingredients?.length > 0;

        return (
            <Card key={meal?.id || index} sx={{borderRadius: 3, backgroundColor: hasIngredients ? 'secondaryContainer' : 'warningContainer'}}>
                <Box sx={{padding: 1}}>
                <Stack direction='row' gap={1}>
                    {planMeal.leftovers ? (
                        <Box
                            sx={{
                                borderRadius: 2,
                                width: 50,
                                height: 50,
                                backgroundColor: 'tertiary',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Kitchen sx={{ fontSize: 24, color: 'onTertiary' }} />
                        </Box>
                    ) : meal?.image?.url ? (
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
                        {meal?.name || 'Unknown Meal'}{planMeal.leftovers ? ' Leftovers' : ''}
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
                <MealItems planMeals={plan.planMeals?.filter(pm => pm.meal != null) || []}/>
            </Stack>
        </Stack>
    )

}