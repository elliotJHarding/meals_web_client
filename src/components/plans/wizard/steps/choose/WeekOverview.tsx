import {Card, CardMedia, Stack, Typography, useMediaQuery, useTheme, Box} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {PlanDto} from "@harding/meals-api";
import {CalendarEventDto} from "@harding/meals-api";
import {motion, LayoutGroup} from "framer-motion";
import {Kitchen, NotesRounded, RestaurantMenu} from "@mui/icons-material";
import ServesChip from "../../../../meals/chip/ServesChip.tsx";
import EffortChip from "../../../../meals/chip/EffortChip.tsx";
import PrepTimeChip from "../../../../meals/chip/PrepTimeChip.tsx";
import IngredientsWarningChip from "../../../../meals/chip/IngredientsWarningChip.tsx";
import DayItem from "./DayItem.tsx";
import {MealDto} from "@harding/meals-api";

interface WeekOverviewProps {
    mealPlan: MealPlan;
    onDayClick: (date: Date) => void;
    calendarEvents: CalendarEventDto[];
    meals: MealDto[];
    mealsLoading: boolean;
    mealsFailed: boolean;
    setMealPlan: (mealPlan: MealPlan) => void;
}

export default function WeekOverview({
    mealPlan,
    onDayClick,
    calendarEvents,
    meals,
    mealsLoading,
    mealsFailed,
    setMealPlan
}: WeekOverviewProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const filterEventsByPlan = (events: CalendarEventDto[], plan: PlanDto): CalendarEventDto[] => {
        return events.filter(event =>
            event.time !== null && plan.date !== null &&
            event.time.getDate() === plan.date.getDate() &&
            event.time.getMonth() === plan.date.getMonth() &&
            event.time.getFullYear() === plan.date.getFullYear()
        );
    };

    const isToday = (plan: PlanDto): boolean => {
        const today: Date = new Date();
        return (
            today.getFullYear() === plan.date.getFullYear() &&
            today.getMonth() === plan.date.getMonth() &&
            today.getDate() === plan.date.getDate()
        );
    };

    const MobileDayItem = ({ plan, calendarEvents }: {
        plan: PlanDto,
        calendarEvents: CalendarEventDto[]
    }) => {
        const onClick = () => onDayClick(plan.date);

        return (
            <Card
                component={motion.div}
                layout
                sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: isToday(plan) ? `2px solid ${theme.sys.color.primary}` : '1px solid rgba(0,0,0,0.12)',
                    background: isToday(plan) ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
                    boxShadow: isToday(plan) ? '0 2px 8px rgba(25, 118, 210, 0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onClick={onClick}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <Stack spacing={2}>
                    {/* Date Header */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant='h6' align="center" sx={{
                            backgroundColor: isToday(plan) ? theme.sys.color.primary : 'transparent',
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isToday(plan) ? 'white' : 'text.secondary',
                            fontWeight: 'bold'
                        }}>
                            {plan.date.getDate()}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Montserrat',
                                color: isToday(plan) ? theme.sys.color.primary : 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            {plan.date.toLocaleDateString('en-gb', { weekday: 'long' })}
                        </Typography>

                        {/* Plan Note */}
                        {plan.note && (
                            <Stack direction='row' gap={1} sx={{ mt: 1 }}>
                                <NotesRounded sx={{ color: 'text.secondary', fontSize: '1rem' }}/>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{
                                        fontWeight: 'bold',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    {plan.note}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>

                    {/* Meals */}
                    {plan.planMeals && plan.planMeals.length > 0 ? (
                        <Stack spacing={1}>
                            {plan.planMeals.map((planMeal, index) => (
                                <Card key={index} sx={{
                                    backgroundColor: planMeal.meal.ingredients.length > 0 ? 'secondaryContainer' : 'warningContainer',
                                    border: 'none',
                                    boxShadow: 'none'
                                }}>
                                    <Stack direction="row" gap={1.5} sx={{ p: 1.5 }} alignItems="start">
                                        {planMeal.leftovers ? (
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    flexShrink: 0,
                                                    backgroundColor: 'tertiary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Kitchen sx={{ fontSize: 20, color: 'onPrimary' }} />
                                            </Box>
                                        ) : planMeal.meal?.image?.url ? (
                                            <CardMedia
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 1.5,
                                                    flexShrink: 0,
                                                    backgroundSize: 'cover'
                                                }}
                                                image={planMeal.meal.image.url}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    flexShrink: 0,
                                                    backgroundColor: 'grey.100',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <RestaurantMenu sx={{ fontSize: 20, color: 'grey.400' }} />
                                            </Box>
                                        )}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            {planMeal.note && (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {planMeal.note}
                                                </Typography>
                                            )}
                                            <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                                                {planMeal.meal?.name || 'Unknown Meal'}{planMeal.leftovers ? ' Leftovers' : ''}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                                                <EffortChip effort={planMeal.meal?.effort} size="small" />
                                                <ServesChip serves={planMeal.requiredServings} size="small" />
                                                <PrepTimeChip prepTimeMinutes={planMeal.meal?.prepTimeMinutes} size="small" />
                                                <IngredientsWarningChip meal={planMeal.meal} size="small" />
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Card>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{
                            p: 2,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            borderRadius: 2,
                            border: '1px dashed rgba(0,0,0,0.12)',
                            textAlign: 'center'
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                Tap to add meals
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Card>
        );
    };

    const dayItems = mealPlan.plans.map((plan, i) =>
        <DayItem
            index={i}
            key={i}
            plan={plan}
            meals={meals}
            mealsLoading={mealsLoading}
            mealsFailed={mealsFailed}
            mealPlan={mealPlan}
            setMealPlan={setMealPlan}
            calendarEvents={filterEventsByPlan(calendarEvents, plan)}
        />
    );

    const dayItemsMobile = mealPlan.plans.map((plan, i) =>
        <MobileDayItem
            key={i}
            plan={plan}
            calendarEvents={filterEventsByPlan(calendarEvents, plan)}
        />
    );

    return (
        <Stack id="WeekOverview" spacing={2} sx={{padding: 2}} component={motion.div} layout>
            {isMobile ? (
                <Stack spacing={2}>
                    {dayItemsMobile}
                </Stack>
            ) : (
                <Box sx={{width: '100%'}} component={motion.div} layout id="DayItems">
                    <LayoutGroup>
                        <motion.table layout style={{width:'100%', borderCollapse: 'collapse'}}>
                            <motion.tbody layout>
                                {dayItems}
                            </motion.tbody>
                        </motion.table>
                    </LayoutGroup>
                </Box>
            )}
        </Stack>
    );
}
