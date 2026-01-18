import {Card, Stack, useMediaQuery, useTheme, Typography, CardMedia} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import {MealDto} from "@elliotJHarding/meals-api";
import {LayoutGroup, motion} from "framer-motion";
import DayItem from "./DayItem.tsx";
import ServesChip from "../../../../meals/chip/ServesChip.tsx";
import EffortChip from "../../../../meals/chip/EffortChip.tsx";
import PrepTimeChip from "../../../../meals/chip/PrepTimeChip.tsx";
import IngredientsWarningChip from "../../../../meals/chip/IngredientsWarningChip.tsx";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import {PlanDto} from "@elliotJHarding/meals-api";
import {CalendarEventDto} from "@elliotJHarding/meals-api";
import CalendarEvents from "./CalendarEvents.tsx";
import {CalendarMonth, NotesRounded, RestaurantMenu, Kitchen} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {useLinkCalendar} from "../../../../../hooks/calendar/useLinkCalendar.ts";
import PlanEditor from "./PlanEditor.tsx";
import {useNavigate} from "react-router-dom";

export default function ChooseMeals({mealPlan, from, to, selected, setMealPlan, meals, mealsLoading, mealsFailed}: {
    mealPlan: MealPlan,
    setMealPlan: (MealPlan: MealPlan) => void,
    from: string | null,
    to: string | null,
    selected: string | null,
    meals: MealDto[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {calendarEvents, isAuthorized} = useCalendarEvents(from || '', to || '');
    const {authorizeCalendar} = useLinkCalendar();
    const selectedPlan : PlanDto | undefined = mealPlan.findPlan(selected)

    const filterEventsByPlan = (events: CalendarEventDto[], plan: PlanDto) : CalendarEventDto[] => {
        if (!plan.date) return [];
        const planDate = new Date(plan.date);
        return events.filter(event => {
            if (!event.time) return false;
            const eventDate = new Date(event.time);
            return eventDate.getDate() === planDate.getDate() &&
                   eventDate.getMonth() === planDate.getMonth() &&
                   eventDate.getFullYear() === planDate.getFullYear();
        });
    }

    const LinkCalendarButton = () =>
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{width: isMobile ? '100%' : '40%', mt: isMobile ? 2 : 0}}>
            <Button 
                variant='outlined' 
                size={isMobile ? 'medium' : 'large'} 
                sx={{
                    borderRadius: 3, 
                    padding: isMobile ? 2 : 4, 
                    width: '100%', 
                    height: isMobile ? 'auto' : '100%', 
                    margin: isMobile ? 0 : 3
                }} 
                startIcon={<CalendarMonth/>} 
                onClick={authorizeCalendar}
            >
                Link Calendar
            </Button>
        </Stack>

    const WholePlan = () =>
        <Stack id="WholePlan" spacing={2} sx={{padding: 2}} component={motion.div} layout>
            {/* Main Plan Section */}
            {isMobile ? (
                <Stack spacing={2}>
                    {dayItemsMobile}
                    {!isAuthorized && <LinkCalendarButton/>}
                </Stack>
            ) : (
                <Stack id="PlanAndEventsRow" direction="row" spacing={2}>
                    <Box sx={{width: !isAuthorized ? '60%' : '100%'}} component={motion.div} layout id="DayItems">
                        <LayoutGroup>
                            <motion.table layout style={{width:'100%', borderCollapse: 'collapse'}}>
                                <motion.tbody layout>
                                    {dayItems}
                                </motion.tbody>
                            </motion.table>
                        </LayoutGroup>
                    </Box>
                    {!isAuthorized && <LinkCalendarButton/>}
                </Stack>
            )}
        </Stack>

    const navigate = useNavigate();

    const MobileDayItem = ({ plan, calendarEvents }: {
        plan: PlanDto,
        calendarEvents: CalendarEventDto[]
    }) => {
        const onClick = () => navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}&selected=${MealPlan.formatDate(plan.date)}`);

        const isToday = (plan: PlanDto): boolean => {
            const today: Date = new Date();
            const planDate = new Date(plan.date);
            return (
                today.getFullYear() === planDate.getFullYear() &&
                today.getMonth() === planDate.getMonth() &&
                today.getDate() === planDate.getDate()
            )
        }

        return (
            <Card
                component={motion.div}
                layout
                sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 3,
                    // @ts-ignore - theme.sys is from MD3 theme
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
                            // @ts-ignore - theme.sys is from MD3 theme
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
                            {new Date(plan.date).getDate()}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Montserrat',
                                // @ts-ignore - theme.sys is from MD3 theme
                                color: isToday(plan) ? theme.sys.color.primary : 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            {new Date(plan.date).toLocaleDateString('en-gb', { weekday: 'long' })}
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
                                    backgroundColor: (planMeal.meal.ingredients?.length ?? 0) > 0 ? 'secondaryContainer' : 'warningContainer',
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

                    {/* Calendar Events */}
                    {calendarEvents.length > 0 && (
                        <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            <CalendarEvents calendarEvents={calendarEvents} />
                        </Box>
                    )}
                </Stack>
            </Card>
        );
    };

    const dayItems = mealPlan.plans.map((plan, i) =>
        <DayItem index={i}
                 key={i}
                 plan={plan}
                 meals={meals}
                 mealsLoading={mealsLoading}
                 mealsFailed={mealsFailed}
                 mealPlan={mealPlan}
                 setMealPlan={setMealPlan}
                 calendarEvents={filterEventsByPlan(calendarEvents, plan)}/>
    );

    const dayItemsMobile = mealPlan.plans.map((plan, i) =>
        <MobileDayItem
            key={i}
            plan={plan}
            calendarEvents={filterEventsByPlan(calendarEvents, plan)}
        />
    );

    return (
        <Card component={motion.div}
              layout
              variant={'outlined'}
              style={{borderRadius: 10, boxShadow: 'none', border: 'none'}}
              initial={{x:100, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: 100, opacity: 0 }}>
            {selectedPlan ? (
                <PlanEditor
                    key={new Date(selectedPlan.date).toISOString()}
                    plan={selectedPlan}
                    mealPlan={mealPlan}
                    meals={meals}
                    mealsLoading={mealsLoading}
                    mealsFailed={mealsFailed}
                    onPlanUpdate={(updatedPlan) => {
                        setMealPlan(new MealPlan([...MealPlan.filterOutPlan(mealPlan.plans, updatedPlan), updatedPlan]));
                    }}
                    calendarEvents={calendarEvents}
                />
            ) : (
                <WholePlan/>
            )}
        </Card>
    );
}
