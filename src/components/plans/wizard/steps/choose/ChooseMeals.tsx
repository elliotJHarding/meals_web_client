import {Card, Stack, Alert, CircularProgress, TextField} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import Meal from "../../../../../domain/Meal.ts";
import {LayoutGroup, motion} from "framer-motion";
import DayItem from "./DayItem.tsx";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import Plan from "../../../../../domain/Plan.ts";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import {CalendarMonth, AutoAwesome} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {useLinkCalendar} from "../../../../../hooks/calendar/useLinkCalendar.ts";
import PlanEditor from "./PlanEditor.tsx";
import {useAiGeneration} from "../../../../../hooks/plan/useAiGeneration.ts";
import {useState} from "react";

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
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{width: '40%'}}>
            <Button variant='outlined' size='large' sx={{borderRadius: 3, padding: 4, width: '100%', height: '100%', margin: 3}} startIcon={<CalendarMonth/>} onClick={authorizeCalendar}>Link Calendar</Button>
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
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
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
                                px: 2,
                                py: 1.5,
                                // fontSize: '1.1rem',
                                fontWeight: 500,
                                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 1,
                                boxShadow: '0 4px 20px rgba(255,152,0,0.3)',
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
        </Stack>

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
                        setMealPlan(new MealPlan([...mealPlan.plans.filter(p => p.date !== updatedPlan.date), updatedPlan]));
                    }}
                    calendarEvents={calendarEvents}
                />
            ) : (
                <WholePlan/>
            )}
        </Card>
    );
}
