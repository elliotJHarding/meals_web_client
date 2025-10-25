import Plan from "../../../../../domain/Plan.ts";
import {Box, InputAdornment, Stack, TextField, Typography, Divider} from "@mui/material";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {ArrowBackIos, EditNoteRounded, Add} from "@mui/icons-material";
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

// Simple debounce implementation
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

interface PlanEditorProps {
    plan: Plan;
    meals: Meal[];
    mealsLoading: boolean;
    mealsFailed: boolean;
    onPlanUpdate: (updatedPlan: Plan) => void;
    calendarEvents: CalendarEvent[];
}

export default function PlanEditor({plan, meals, mealsLoading, mealsFailed, onPlanUpdate, calendarEvents}: PlanEditorProps) {
    const navigate = useNavigate();
    const {updatePlan} = usePlanUpdate();
    const {createPlan} = usePlanCreate();
    const [currentPlan, setCurrentPlan] = useState<Plan>({
        ...plan,
        planMeals: plan.planMeals || []
    });
    const [mealChooserOpen, setMealChooserOpen] = useState(false);

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.time);
        const planDate = new Date(plan.date);
        return eventDate.toDateString() === planDate.toDateString();
    });

    // Function to sync plan to backend (create or update)
    const syncPlanToBackend = useCallback((updatedPlan: Plan) => {
        if (updatedPlan.id) {
            console.log("Updating existing plan in backend:", updatedPlan);
            updatePlan(updatedPlan, () => {
                console.log("Plan updated successfully");
                // Notify parent AFTER backend confirms the update
                // Use the updatedPlan we sent (with full meal objects), not what backend returns
                onPlanUpdate(updatedPlan);
            });
        } else {
            console.log("Creating new plan in backend:", updatedPlan);
            createPlan(updatedPlan, (createdPlan: Plan) => {
                console.log("Plan created successfully:", createdPlan);
                // Update local state with the newly created plan (now has ID)
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
        
        // Immediate sync for meal removal
        syncPlanToBackend(updatedPlan);
    };

    const handleAddMeal = (meal: Meal) => {
        console.group('handleAddMeal called');
        console.log('Meal object:', meal);
        console.log('Current plan:', currentPlan);

        const newPlanMeal: PlanMeal = {
            meal,
            requiredServings: meal.serves
        };
        const updatedPlan = {
            ...currentPlan,
            planMeals: [...(currentPlan.planMeals || []), newPlanMeal]
        };

        console.log('Updated plan with new meal:', updatedPlan);
        console.log('Updated plan meals count:', updatedPlan.planMeals.length);
        console.log('Last meal in plan:', updatedPlan.planMeals[updatedPlan.planMeals.length - 1]);
        console.groupEnd();

        // Set local state immediately for optimistic update
        setCurrentPlan(updatedPlan);

        // Close dialog
        setMealChooserOpen(false);

        // Sync to backend - DO NOT call onPlanUpdate until we're sure the state has updated
        // The parent will eventually get the updated data when needed (e.g., on navigation)
        syncPlanToBackend(updatedPlan);
};

    return (
        <Box component={motion.div} layout width={'100%'}>
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems={'center'} sx={{ p: 2, pb: 1 }}>
                <Button
                    variant={'text'}
                    size={'medium'}
                    sx={{borderRadius: 2, paddingX: 1, paddingY: 1, minWidth: 'auto'}}
                    startIcon={<ArrowBackIos/>}
                    onClick={() => navigate(-1)}
                    component={motion.div}
                    layout
                >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                            variant='h6'
                            sx={{
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                        </Typography>
                        <Typography
                            sx={{fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 500}}
                        >
                            {plan.date.toLocaleDateString('en-gb', {weekday: 'long'})}
                        </Typography>
                    </Stack>
                </Button>

                <TextField
                    size={'small'}
                    fullWidth
                    value={currentPlan.note || ''}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <EditNoteRounded sx={{ fontSize: '1rem' }}/>
                            </InputAdornment>
                        ),
                        placeholder: 'Add a note for this day',
                        sx: { borderRadius: 2 }
                    }}
                />
            </Stack>

            <Box sx={{ px: 2, pb: 2 }}>
                <Grid container spacing={2}>
                    {/* Meals Section */}
                    <Grid xs={12} md={8}>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight="600">
                                    Meals
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={() => setMealChooserOpen(true)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Meal
                                </Button>
                            </Stack>

                            <Divider />

                            {(currentPlan.planMeals || []).length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        color: 'text.secondary',
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        border: '2px dashed',
                                        borderColor: 'grey.300'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        No meals planned for this day
                                    </Typography>
                                    <Button
                                        variant="text"
                                        onClick={() => setMealChooserOpen(true)}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Add your first meal
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {(currentPlan.planMeals || []).map((planMeal, index) => (
                                        <MealItem
                                            key={index}
                                            planMeal={planMeal}
                                            onServingsChange={(newServings) => handleServingsChange(index, newServings)}
                                            onNoteChange={(newNote) => handleMealNoteChange(index, newNote)}
                                            onRemove={() => handleRemoveMeal(index)}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Grid>

                    {/* Calendar Events Section */}
                    <Grid xs={12} md={4}>
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            <CalendarEvents calendarEvents={filteredCalendarEvents} />
                        </Box>
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
            />
        </Box>
    );
}