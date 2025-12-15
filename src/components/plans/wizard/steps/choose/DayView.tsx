import Plan from "../../../../../domain/Plan.ts";
import {Box, InputAdornment, Stack, TextField, Typography, Divider, Paper, useTheme} from "@mui/material";
import {motion} from "framer-motion";
import {EditNoteRounded, Add} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import Grid from "@mui/material/Unstable_Grid2";
import CalendarEvents from "./CalendarEvents.tsx";
import {useState, useCallback} from "react";
import {usePlanUpdate} from "../../../../../hooks/plan/usePlanUpdate.ts";
import {usePlanCreate} from "../../../../../hooks/plan/usePlanCreate.ts";
import MealItem from "./MealItem.tsx";
import MealChooser from "../../../../dialog/MealChooser.tsx";
import Meal from "../../../../../domain/Meal.ts";
import PlanMeal from "../../../../../domain/PlanMeal.ts";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import MealPlan from "../../../../../domain/MealPlan.ts";
import AiChatInput from "./AiChatInput.tsx";
import SuggestedMealCard from "./SuggestedMealCard.tsx";
import SuggestedMeal from "../../../../../domain/ai/SuggestedMeal.ts";
import { useAiMealChat } from "../../../../../hooks/ai/useAiMealChat.ts";

// Simple debounce implementation
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

interface DayViewProps {
    plan: Plan;
    mealPlan: MealPlan;
    meals: Meal[];
    mealsLoading: boolean;
    mealsFailed: boolean;
    onPlanUpdate: (updatedPlan: Plan) => void;
    calendarEvents: CalendarEvent[];
}

export default function DayView({
    plan,
    mealPlan,
    meals,
    mealsLoading,
    mealsFailed,
    onPlanUpdate,
    calendarEvents
}: DayViewProps) {
    const {updatePlan} = usePlanUpdate();
    const {createPlan} = usePlanCreate();
    const [currentPlan, setCurrentPlan] = useState<Plan>({
        ...plan,
        planMeals: plan.planMeals || []
    });
    const [mealChooserOpen, setMealChooserOpen] = useState(false);

    const theme = useTheme();

    // AI Chat Hook
    const {
        conversationHistory,
        currentSuggestions,
        inputMessage,
        isLoading: aiLoading,
        setInputMessage,
        sendMessage,
        removeSuggestion
    } = useAiMealChat(plan, mealPlan, meals, calendarEvents);

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.time);
        const planDate = new Date(plan.date);
        return eventDate.toDateString() === planDate.toDateString();
    });

    // Function to sync plan to backend (create or update)
    const syncPlanToBackend = useCallback((updatedPlan: Plan) => {
        if (updatedPlan.id) {
            updatePlan(updatedPlan, () => {
                onPlanUpdate(updatedPlan);
            });
        } else {
            createPlan(updatedPlan, (createdPlan: Plan) => {
                const planWithId : Plan = {...updatedPlan, id: createdPlan.id};
                setCurrentPlan(planWithId);
                onPlanUpdate(planWithId);
            });
        }
    }, [updatePlan, createPlan, onPlanUpdate]);

    // Debounced version for text changes
    const debouncedSyncPlan = useCallback(
        debounce(syncPlanToBackend, 500),
        [syncPlanToBackend]
    );

    const handleNoteChange = (note: string) => {
        const updatedPlan = { ...currentPlan, note };
        setCurrentPlan(updatedPlan);
        onPlanUpdate(updatedPlan);
        debouncedSyncPlan(updatedPlan);
    };

    const handleServingsChange = (planMealIndex: number, newServings: number) => {
        const updatedPlanMeals = [...(currentPlan.planMeals || [])];
        updatedPlanMeals[planMealIndex] = {
            ...updatedPlanMeals[planMealIndex],
            requiredServings: newServings
        };
        const updatedPlan = { ...currentPlan, planMeals: updatedPlanMeals };
        setCurrentPlan(updatedPlan);
        onPlanUpdate(updatedPlan);
        debouncedSyncPlan(updatedPlan);
    };

    const handleMealNoteChange = (planMealIndex: number, newNote: string) => {
        const updatedPlanMeals = [...(currentPlan.planMeals || [])];
        updatedPlanMeals[planMealIndex] = {
            ...updatedPlanMeals[planMealIndex],
            note: newNote
        };
        const updatedPlan = { ...currentPlan, planMeals: updatedPlanMeals };
        setCurrentPlan(updatedPlan);
        onPlanUpdate(updatedPlan);
        debouncedSyncPlan(updatedPlan);
    };

    const handleRemoveMeal = (planMealIndex: number) => {
        const updatedPlanMeals = (currentPlan.planMeals || []).filter((_, index) => index !== planMealIndex);
        const updatedPlan = { ...currentPlan, planMeals: updatedPlanMeals };
        setCurrentPlan(updatedPlan);
        onPlanUpdate(updatedPlan);
        syncPlanToBackend(updatedPlan);
    };

    const handleAddMeal = (meal: Meal, servings: number, leftovers: boolean) => {
        const newPlanMeal: PlanMeal = {
            meal,
            requiredServings: servings,
            leftovers: leftovers
        };
        const updatedPlan = {
            ...currentPlan,
            planMeals: [...(currentPlan.planMeals || []), newPlanMeal]
        };

        setCurrentPlan(updatedPlan);
        setMealChooserOpen(false);
        syncPlanToBackend(updatedPlan);
    };

    const handleSendAiMessage = () => {
        sendMessage(inputMessage);
    };

    const handleAddSuggestedMeal = (suggestedMeal: SuggestedMeal) => {
        removeSuggestion(suggestedMeal.meal.id);
        handleAddMeal(suggestedMeal.meal, suggestedMeal.meal.serves, false);
    };

    return (
        <Box component={motion.div} layout width={'100%'}>
            <Box sx={{ px: 2, pb: 2, pt: 3 }}>
                {/* Day Header */}
                <Stack spacing={2} sx={{ mb: 3 }}>

                    {/* Day Note Field - Prominent position */}
                    <TextField
                        fullWidth
                        size='small'
                        value={currentPlan.note || ''}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder={`Add a note for ${plan.date.toLocaleDateString('en-gb', {weekday: 'long'})}`}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <EditNoteRounded />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'grey.50',
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'divider',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'background.paper',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.sys.color.tertiary,
                                },
                            },
                        }}
                    />
                </Stack>

                <Grid container spacing={3}>
                    {/* Meals Section */}
                    <Grid xs={12} md={8}>
                        <Stack spacing={2}>
                            {/* Section Header */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6" fontWeight="600">
                                    Meals
                                </Typography>
                                <Button
                                    variant="filled"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={() => setMealChooserOpen(true)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Meal
                                </Button>
                            </Stack>

                            <Divider />

                            {/* AI Chat Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    backgroundColor: 'grey.50',
                                    borderRadius: 2,
                                    border: '2px solid',
                                    borderColor: 'grey.200'
                                }}
                            >
                                <Stack spacing={2}>

                                    {/* AI Chat Input */}
                                    <AiChatInput
                                        value={inputMessage}
                                        onChange={setInputMessage}
                                        onSend={handleSendAiMessage}
                                        isLoading={aiLoading}
                                    />

                                    {/* Display latest AI response */}
                                    {conversationHistory.length > 0 && (() => {
                                        const lastAssistantMessage = [...conversationHistory]
                                            .reverse()
                                            .find(msg => msg.role === 'assistant');

                                        return lastAssistantMessage ? (
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: 1.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap'
                                                    }}
                                                >
                                                    {lastAssistantMessage.content}
                                                </Typography>
                                            </Box>
                                        ) : null;
                                    })()}

                                    {/* AI Suggested Meals */}
                                    {currentSuggestions.length > 0 && (
                                        <Stack spacing={1}>
                                            <Typography variant="caption" fontWeight="600" color="text.secondary">
                                                Suggested Meals
                                            </Typography>
                                            {currentSuggestions.map((suggestion, index) => (
                                                <SuggestedMealCard
                                                    key={`ai-${index}`}
                                                    suggestedMeal={suggestion}
                                                    onAddMeal={handleAddSuggestedMeal}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Stack>
                            </Paper>

                            {/* Planned Meals Section */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight="600" color="text.secondary" sx={{ mb: 1 }}>
                                    Planned Meals
                                </Typography>

                                {(currentPlan.planMeals || []).length > 0 ? (
                                    <Stack spacing={1}>
                                        {(currentPlan.planMeals || []).map((planMeal, index) => (
                                            <MealItem
                                                key={`planned-${index}`}
                                                planMeal={planMeal}
                                                onServingsChange={(newServings) => handleServingsChange(index, newServings)}
                                                onNoteChange={(newNote) => handleMealNoteChange(index, newNote)}
                                                onRemove={() => handleRemoveMeal(index)}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            backgroundColor: 'grey.50',
                                            borderRadius: 2,
                                            border: '2px dashed',
                                            borderColor: 'grey.300',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No meals planned yet. Add a meal or ask AI for suggestions.
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Calendar Events Section */}
                    <Grid xs={12} md={4}>
                        <Stack spacing={2}>
                            <Typography variant="h6" fontWeight="600">
                                Events
                            </Typography>
                            <Divider />
                            {filteredCalendarEvents.length > 0 ? (
                                <CalendarEvents calendarEvents={filteredCalendarEvents} />
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No events scheduled
                                    </Typography>
                                </Paper>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            {/* Meal Chooser Dialog */}
            <MealChooser
                meals={meals}
                mealsLoading={mealsLoading}
                mealsFailed={mealsFailed}
                open={mealChooserOpen}
                setOpen={setMealChooserOpen}
                onConfirm={handleAddMeal}
                mealPlan={mealPlan}
                currentPlan={plan}
            />
        </Box>
    );
}
