import {Card, Stack, Alert, CircularProgress, TextField, useMediaQuery, useTheme, Typography, CardMedia} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import Meal from "../../../../../domain/Meal.ts";
import {LayoutGroup, motion} from "framer-motion";
import DayItem from "./DayItem.tsx";
import ServesChip from "../../../../meals/chip/ServesChip.tsx";
import EffortChip from "../../../../meals/chip/EffortChip.tsx";
import PrepTimeChip from "../../../../meals/chip/PrepTimeChip.tsx";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import Plan from "../../../../../domain/Plan.ts";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import CalendarEvents from "./CalendarEvents.tsx";
import {CalendarMonth, AutoAwesome, NotesRounded} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {useLinkCalendar} from "../../../../../hooks/calendar/useLinkCalendar.ts";
import PlanEditor from "./PlanEditor.tsx";
import {useAiGeneration} from "../../../../../hooks/plan/useAiGeneration.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ChooseMeals({mealPlan, from, to, selected, setMealPlan, meals, mealsLoading, mealsFailed}: {
    mealPlan: MealPlan,
    setMealPlan: (MealPlan: MealPlan) => void,
    from: string | null,
    to: string | null,
    selected: string | null,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {calendarEvents, isAuthorized} = useCalendarEvents(from || '', to || '');
    const {authorizeCalendar} = useLinkCalendar();
    const {generateMealPlan, loading: aiLoading, failed: aiFailed} = useAiGeneration();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [promptText, setPromptText] = useState("");
    const selectedPlan : Plan | undefined = mealPlan.findPlan(selected)

    const filterEventsByPlan = (events: CalendarEvent[], plan: Plan) : CalendarEvent[] => {
        return events.filter(event =>
            event.time !== null && plan.date !== null &&
            event.time.getDate() === plan.date.getDate() &&
            event.time.getMonth() === plan.date.getMonth() &&
            event.time.getFullYear() === plan.date.getFullYear()
        );
    }

    const handleAiGenerate = () => {
        if (mealPlan.plans.length === 0) return;
        
        const startDate = mealPlan.plans[0].date;
        const endDate = mealPlan.plans[mealPlan.plans.length - 1].date;
        
        generateMealPlan(startDate, endDate, promptText, (generatedPlans) => {
            setMealPlan(new MealPlan(generatedPlans));
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        });
    };

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
        <Stack spacing={2} sx={{padding: 2}} component={motion.div} layout>
            {/* AI Generation Section */}
            <Card 
                variant="outlined" 
                sx={{ 
                    p: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(255,152,0,0.05) 0%, rgba(255,193,7,0.08) 100%)',
                    border: '1px solid rgba(255,152,0,0.2)'
                }}
                component={motion.div}
                layout
            >
                <Stack spacing={2}>
                    <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "stretch" : "center"}>
                        <Box sx={{ 
                            position: 'relative', 
                            display: 'inline-block', 
                            flexShrink: 0,
                            alignSelf: isMobile ? 'center' : 'auto'
                        }}>
                        {/* Outer pulsing glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 4,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                            style={{
                                position: 'absolute',
                                top: -8,
                                left: -8,
                                right: -8,
                                bottom: -8,
                                borderRadius: 5,
                                background: 'radial-gradient(ellipse, rgba(255,193,7,0.4) 0%, rgba(255,152,0,0.3) 40%, rgba(255,87,34,0.2) 70%, transparent 100%)',
                                filter: 'blur(6px)',
                            }}
                        />
                        
                        {/* Inner shimmer */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.8, 0.3],
                                scale: [1, 1.02, 1],
                            }}
                            transition={{
                                duration: 2.5,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: 0.5,
                            }}
                            style={{
                                position: 'absolute',
                                top: -4,
                                left: -4,
                                right: -4,
                                bottom: -4,
                                borderRadius: 5,
                                background: 'linear-gradient(135deg, rgba(255,193,7,0.3), rgba(255,152,0,0.5), rgba(255,87,34,0.3))',
                                filter: 'blur(3px)',
                            }}
                        />
                        
                        {/* Central glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.03, 1],
                                opacity: [0.4, 0.7, 0.4],
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: 1,
                            }}
                            style={{
                                position: 'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,193,7,0.2)',
                                filter: 'blur(1px)',
                            }}
                        />

                        <Button
                            variant="filled"
                            startIcon={aiLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <AutoAwesome />}
                            onClick={handleAiGenerate}
                            disabled={aiLoading || mealPlan.plans.length === 0}
                            sx={{
                                borderRadius: 3,
                                px: isMobile ? 3 : 2,
                                py: 1.5,
                                fontWeight: 500,
                                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 1,
                                boxShadow: '0 4px 20px rgba(255,152,0,0.3)',
                                width: isMobile ? '100%' : 'auto',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #f57c00 0%, #e64a19 100%)',
                                    boxShadow: '0 6px 25px rgba(255,152,0,0.4)',
                                    transform: 'translateY(-2px)',
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                    color: 'rgba(0, 0, 0, 0.26)',
                                    boxShadow: 'none',
                                },
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            {aiLoading ? 'Generating AI Meal Plan...' : 'Generate Meal Plan'}
                        </Button>
                        </Box>
                        <TextField
                            fullWidth
                            label="Prompt (optional)"
                            placeholder="e.g., focus on healthy meals, include vegetarian options, avoid spicy food..."
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                }
                            }}
                        />
                    </Stack>
                    
                    {showSuccessMessage && (
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                            AI meal plan generated successfully!
                        </Alert>
                    )}
                    
                    {aiFailed && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            Failed to generate meal plan. Please try again.
                        </Alert>
                    )}
                </Stack>
            </Card>

            {/* Main Plan Section */}
            {isMobile ? (
                <Stack spacing={2}>
                    {dayItemsMobile}
                    {!isAuthorized && <LinkCalendarButton/>}
                </Stack>
            ) : (
                <Stack direction="row" spacing={2}>
                    <Box sx={{width: !isAuthorized ? '60%' : '100%'}} component={motion.div} layout>
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
        plan: Plan,
        calendarEvents: CalendarEvent[]
    }) => {
        const onClick = () => navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}&selected=${MealPlan.formatDate(plan.date)}`);
        
        const isToday = (plan: Plan): boolean => {
            const today: Date = new Date();
            return (
                today.getFullYear() === plan.date.getFullYear() &&
                today.getMonth() === plan.date.getMonth() &&
                today.getDate() === plan.date.getDate()
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
                    </Stack>

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

                    {/* Meals */}
                    {plan.planMeals && plan.planMeals.length > 0 ? (
                        <Stack spacing={1}>
                            {plan.planMeals.map((planMeal, index) => (
                                <Card key={index} sx={{ 
                                    backgroundColor: 'secondaryContainer',
                                    border: 'none',
                                    boxShadow: 'none'
                                }}>
                                    <Stack direction="row" gap={1.5} sx={{ p: 1.5 }} alignItems="center">
                                        <CardMedia
                                            sx={{
                                                width: 50,
                                                height: 40,
                                                borderRadius: 1.5,
                                                flexShrink: 0,
                                                backgroundColor: planMeal.meal?.image?.url ? 'transparent' : 'grey.200',
                                                backgroundSize: 'cover'
                                            }}
                                            image={planMeal.meal?.image?.url || '/placeholder-meal.png'}
                                        />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            {planMeal.note && (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {planMeal.note}
                                                </Typography>
                                            )}
                                            <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                                                {planMeal.meal?.name || 'Unknown Meal'}
                                            </Typography>
                                            <Stack direction="row" gap={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                                <EffortChip effort={planMeal.meal?.effort} size="small" />
                                                <ServesChip serves={planMeal.requiredServings} size="small" />
                                                <PrepTimeChip prepTimeMinutes={planMeal.meal?.prepTimeMinutes} size="small" />
                                            </Stack>
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
                    plan={selectedPlan}
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
