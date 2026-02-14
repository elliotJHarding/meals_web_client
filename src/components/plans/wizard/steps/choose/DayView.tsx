import {PlanDto, MealDto, PlanMealDto, CalendarEventDto, SuggestedMeal} from "@elliotJHarding/meals-api";
import {Box, InputAdornment, Stack, TextField, Typography, Divider, Paper, useTheme} from "@mui/material";

import {EditNoteRounded, Add} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import Grid from "@mui/material/Unstable_Grid2";
import CalendarEvents from "./CalendarEvents.tsx";
import {useState, useCallback} from "react";
import {usePlanUpdate} from "../../../../../hooks/plan/usePlanUpdate.ts";
import {usePlanCreate} from "../../../../../hooks/plan/usePlanCreate.ts";
import MealItem from "./MealItem.tsx";
import MealChooser from "../../../../dialog/MealChooser.tsx";
import MealPlan from "../../../../../domain/MealPlan.ts";
import SuggestedMealCard from "./SuggestedMealCard.tsx";

// Simple debounce implementation
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

interface DayViewProps {
    plan: PlanDto;
    mealPlan: MealPlan;
    meals: MealDto[];
    mealsLoading: boolean;
    mealsFailed: boolean;
    onPlanUpdate: (updatedPlan: PlanDto) => void;
    calendarEvents: CalendarEventDto[];
    // AI suggestions passed from parent
    currentSuggestions: SuggestedMeal[];
    onRemoveSuggestion: (mealId: number | undefined) => void;
}

export default function DayView({
    plan,
    mealPlan,
    meals,
    mealsLoading,
    mealsFailed,
    onPlanUpdate,
    calendarEvents,
    currentSuggestions,
    onRemoveSuggestion
}: DayViewProps) {
    const {updatePlan} = usePlanUpdate();
    const {createPlan} = usePlanCreate();
    const [currentPlan, setCurrentPlan] = useState<PlanDto>({
        ...plan,
        planMeals: plan.planMeals || []
    });
    const [mealChooserOpen, setMealChooserOpen] = useState(false);

    const theme = useTheme();

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.time);
        const planDate = new Date(plan.date);
        return eventDate.toDateString() === planDate.toDateString();
    });

    // Function to sync plan to backend (create or update)
    const syncPlanToBackend = useCallback((updatedPlan: PlanDto) => {
        if (updatedPlan.id) {
            updatePlan(updatedPlan, () => {
                onPlanUpdate(updatedPlan);
            });
        } else {
            createPlan(updatedPlan, (createdPlan: PlanDto) => {
                const planWithId : PlanDto = {...updatedPlan, id: createdPlan.id};
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

    const handleAddMeal = (meal: MealDto, servings: number, leftovers: boolean) => {
        const newPlanMeal: PlanMealDto = {
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

    const handleAddSuggestedMeal = (suggestedMeal: SuggestedMeal) => {
        // Look up the full meal from the meals array using the mealId
        const meal = meals.find(m => m.id === suggestedMeal.mealId);
        if (meal) {
            onRemoveSuggestion(suggestedMeal.mealId);
            handleAddMeal(meal, meal.serves ?? 4, false);
        }
    };

    return (
        <Box width={'100%'}>
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

                            {/* AI Suggested Meals Section */}
                            {currentSuggestions.length > 0 && (
                                <Stack spacing={1}>
                                    {currentSuggestions.map((suggestion, index) => (
                                        <SuggestedMealCard
                                            key={`ai-${index}`}
                                            suggestedMeal={suggestion}
                                            meals={meals}
                                            onAddMeal={handleAddSuggestedMeal}
                                        />
                                    ))}
                                </Stack>
                            )}

                            {/* Planned Meals Section */}
                            <Box>
                                {/*<Typography variant="subtitle2" fontWeight="600" color="text.secondary" sx={{ mb: 1 }}>*/}
                                {/*    Planned Meals*/}
                                {/*</Typography>*/}

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
