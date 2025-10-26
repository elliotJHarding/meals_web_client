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
import MealPlan from "../../../../../domain/MealPlan.ts";
import IconButton from "@mui/material-next/IconButton";

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
    mealPlan: MealPlan;
    meals: Meal[];
    mealsLoading: boolean;
    mealsFailed: boolean;
    onPlanUpdate: (updatedPlan: Plan) => void;
    calendarEvents: CalendarEvent[];
}

export default function PlanEditor({plan, mealPlan, meals, mealsLoading, mealsFailed, onPlanUpdate, calendarEvents}: PlanEditorProps) {
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

    const handleAddMeal = (meal: Meal, servings: number, leftovers: boolean) => {
        console.group('handleAddMeal called');
        console.log('Meal object:', meal);
        console.log('Servings:', servings);
        console.log('Leftovers:', leftovers);
        console.log('Current plan:', currentPlan);

        const newPlanMeal: PlanMeal = {
            meal,
            requiredServings: servings,
            leftovers: leftovers
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

    const handleDayClick = (dayPlan: Plan) => {
        navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}&selected=${MealPlan.formatDate(dayPlan.date)}`);
    };

    const getCurrentDayIndex = () => {
        return mealPlan.plans.findIndex(p => p.date.toDateString() === plan.date.toDateString());
    };

    const getPreviousDay = () => {
        const currentIndex = getCurrentDayIndex();
        if (currentIndex > 0) {
            return mealPlan.plans[currentIndex - 1];
        }
        return null;
    };

    const getNextDay = () => {
        const currentIndex = getCurrentDayIndex();
        if (currentIndex < mealPlan.plans.length - 1) {
            return mealPlan.plans[currentIndex + 1];
        }
        return null;
    };

    const handlePreviousDay = () => {
        const prevDay = getPreviousDay();
        if (prevDay) {
            handleDayClick(prevDay);
        }
    };

    const handleNextDay = () => {
        const nextDay = getNextDay();
        if (nextDay) {
            handleDayClick(nextDay);
        }
    };

    return (
        <Box component={motion.div} layout width={'100%'}>
            {/* Day Navigation Header */}
            <Box sx={{
                p: 2,
                pb: 1,
                position: 'relative'
            }}>
                <Stack direction="row" alignItems="center" component={motion.div} layout='position'>
                    {/* Back Button */}
                    <Button
                        variant={'text'}
                        size={'medium'}
                        sx={{
                            borderRadius: 2,
                            paddingX: 1,
                            paddingY: 1,
                            minWidth: 'auto',
                            position: 'absolute',
                            left: 16,
                            zIndex: 1
                        }}
                        startIcon={<ArrowBackIos/>}
                        onClick={() => navigate(`/plans/create/choose?from=${mealPlan.from()}&to=${mealPlan.to()}`)}
                    >Back</Button>

                    {/* Day Navigation - Centered on desktop, flexible on mobile */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: { xs: 'flex-end', md: 'center' },
                        alignItems: 'center',
                        pl: { xs: 0, md: 0 },
                        ml: { xs: '60px', md: 0 }
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {/* Previous Day Button */}
                            <IconButton
                                size="small"
                                onClick={handlePreviousDay}
                                disabled={!getPreviousDay()}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'tertiary',
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3
                                    }
                                }}
                            >
                                <ArrowBackIos fontSize="small" />
                            </IconButton>

                            {/* Current Day Display */}
                            <Stack direction="row" alignItems="center" spacing={0.5} component={motion.div} layout='position' sx={{ minWidth: '150px', justifyContent: 'center' }}>
                                <Typography
                                    variant='h6'
                                    sx={{
                                        width: '2rem',
                                        height: '2rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'tertiary'
                                    }}
                                >
                                    {plan.date.toLocaleDateString('en-gb', {day: 'numeric'})}
                                </Typography>
                                <Typography
                                    sx={{fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 500, color: 'tertiary'}}
                                >
                                    {plan.date.toLocaleDateString('en-gb', {weekday: 'long'})}
                                </Typography>
                            </Stack>

                            {/* Next Day Button */}
                            <IconButton
                                size="small"
                                onClick={handleNextDay}
                                disabled={!getNextDay()}
                                sx={{
                                    color: 'text.secondary',
                                    transform: 'rotate(180deg)',
                                    '&:hover': {
                                        color: 'tertiary',
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3
                                    }
                                }}
                            >
                                <ArrowBackIos fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ px: 2, pb: 2 }}>
                <Grid container spacing={2}>
                    {/* Meals Section */}
                    <Grid xs={12} md={8}>
                        <Stack spacing={2}>
                            <Stack direction="row" gap={2} alignItems="center">
                                <Typography variant="h6" fontWeight="600" sx={{mt: 0.5}}>
                                    Meals
                                </Typography>
                                <TextField
                                    size={'small'}
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
                                    sx={{
                                        mt: 0.5,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            '&:hover fieldset': {
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: '1px solid',
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}

                                />
                                <Box flexGrow={1} />
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
                mealPlan={mealPlan}
                currentPlan={plan}
            />
        </Box>
    );
}