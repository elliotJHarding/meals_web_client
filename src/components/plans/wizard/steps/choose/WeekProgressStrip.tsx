import {Box, Stack, Typography, useMediaQuery, useTheme, Avatar} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {CalendarViewWeek, RestaurantMenu, Kitchen} from "@mui/icons-material";
import {PlanMealDto} from "@elliotJHarding/meals-api";
import {motion} from "framer-motion";

interface WeekProgressStripProps {
    mealPlan: MealPlan;
    selectedDate: Date | null;
    onDaySelect: (date: Date | null) => void;
    showMealCounts?: boolean;
    highlightToday?: boolean;
}

interface DayStripItem {
    date: Date;
    dayName: string;
    dayNumber: number;
    mealCount: number;
    planMeals: PlanMealDto[];
    isSelected: boolean;
    isToday: boolean;
    hasNote: boolean;
}

export default function WeekProgressStrip({
    mealPlan,
    selectedDate,
    onDaySelect,
    showMealCounts = true,
    highlightToday = true
}: WeekProgressStripProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        );
    };

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const isWeekOverviewSelected = selectedDate === null;

    const dayItems: DayStripItem[] = mealPlan.plans.map(plan => {
        const planMeals = plan.planMeals || [];
        const mealCount = planMeals.length;
        return {
            date: plan.date,
            dayName: plan.date.toLocaleDateString('en-gb', { weekday: isMobile ? 'short' : 'short' }),
            dayNumber: plan.date.getDate(),
            mealCount,
            planMeals,
            isSelected: selectedDate !== null && isSameDay(plan.date, selectedDate),
            isToday: highlightToday && isToday(plan.date),
            hasNote: !!plan.note
        };
    });

    const renderMealIndicator = (planMeals: PlanMealDto[], isSelected: boolean, hasNote: boolean) => {
        if (planMeals.length === 0) {
            // Show a dot if there's a note, otherwise show a dash
            if (hasNote) {
                return (
                    <Box
                        sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: isSelected ? theme.sys.color.onPrimary : theme.sys.color.secondary
                        }}
                    />
                );
            }
            return (
                <Typography variant="caption" color={isSelected ? theme.sys.color.onPrimary : theme.sys.color.secondary} sx={{ fontSize: '1.0rem' }}>
                    -
                </Typography>
            );
        }

        const maxVisible = 3;
        const visibleMeals = planMeals.slice(0, maxVisible);
        const remainingCount = planMeals.length - maxVisible;

        return (
            <Stack direction="row" spacing={0.2} alignItems="center">
                {visibleMeals.map((planMeal, i) => {
                    const meal = planMeal.meal;
                    const hasImage = meal?.image?.url;
                    // Leftovers always show Kitchen icon, never the image (matching overview behavior)
                    const showImage = hasImage && !planMeal.leftovers;

                    return (
                        <Avatar
                            key={i}
                            src={showImage ? meal.image.url : undefined}
                            sx={{
                                width: { xs: 16, md: 18 },
                                height: { xs: 16, md: 18 },
                                bgcolor: planMeal.leftovers ? theme.sys.color.tertiary : (showImage ? 'transparent' : 'grey.300'),
                                border: isSelected ? `1px solid ${theme.sys.color.onPrimary}` : 'none'
                            }}
                        >
                            {!showImage && (
                                planMeal.leftovers ? (
                                    <Kitchen sx={{ fontSize: { xs: 10, md: 12 }, color: theme.sys.color.onTertiary }} />
                                ) : (
                                    <RestaurantMenu sx={{ fontSize: { xs: 10, md: 12 }, color: 'grey.600' }} />
                                )
                            )}
                        </Avatar>
                    );
                })}
                {remainingCount > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: { xs: '0.6rem', md: '0.65rem' },
                            fontWeight: 600,
                            color: isSelected ? theme.sys.color.onPrimary : theme.sys.color.tertiary,
                            ml: 0.2
                        }}
                    >
                        +{remainingCount}
                    </Typography>
                )}
            </Stack>
        );
    };

    return (
        <Box
            component={motion.div} layout
            sx={{
                width: '100%',
                bgcolor: 'transparent',
                overflowX: { xs: 'auto', md: 'hidden' },
                overflowY: 'hidden', // Prevent vertical scrollbar from appearing
                '&::-webkit-scrollbar': {
                    height: 4
                },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'grey.300',
                    borderRadius: 2
                }
            }}
        >
            <Stack
                direction="row"
                spacing={{ xs: 0.3, md: 0.5 }}
                component={motion.div} layout
                sx={{
                    p: { xs: 1.5, md: 2 },
                    minWidth: 'fit-content',
                    justifyContent: { xs: 'flex-start', md: 'center' }
                }}
            >

                {dayItems.map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => onDaySelect(item.date)}
                        component={motion.div} layout
                        sx={{
                            cursor: 'pointer',
                            minWidth: { xs: 50, md: 50 },
                            px: { xs: 0.5, md: 1.5 },
                            py: { xs: 1, md: 1.5 },
                            borderRadius: 5,
                            bgcolor: item.isSelected ? theme.sys.color.primary : 'transparent',
                            border: item.isToday && !item.isSelected ? `2px solid ${theme.sys.color.tertiary}` : '2px solid transparent',
                            transition: 'background-color 0.2s ease, border-color 0.2s ease',
                            '&:hover': {
                                bgcolor: item.isSelected ? theme.sys.color.primary : 'action.hover'
                            }
                        }}
                    >
                        <Stack alignItems="center">
                            {/* Day Name */}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: { xs: '0.6rem', md: '0.7rem' },
                                    fontWeight: 600,
                                    color: item.isSelected ? theme.sys.color.onPrimary : 'text.secondary',
                                    textTransform: 'uppercase',
                                    mb: 0.3
                                }}
                            >
                                {item.dayName}
                            </Typography>

                            {/* Day Number */}
                            <Box
                                sx={{
                                    width: { xs: 28, md: 32 },
                                    height: { xs: 28, md: 32 },
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 0.7,
                                    bgcolor: item.isSelected ? theme.sys.color.onPrimary : (item.isToday ? theme.sys.color.primary : 'transparent')
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: item.isSelected ? theme.sys.color.primary : (item.isToday ? theme.sys.color.onPrimary : 'text.primary'),
                                        fontSize: { xs: '0.85rem', md: '0.95rem' }
                                    }}
                                >
                                    {item.dayNumber}
                                </Typography>
                            </Box>

                            {/* Meal Count Indicator */}
                            {showMealCounts && (
                                <Box
                                    sx={{
                                        height: { xs: 12, md: 16 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {renderMealIndicator(item.planMeals, item.isSelected, item.hasNote)}
                                </Box>
                            )}
                        </Stack>
                    </Box>
                ))}
                {/* Week Overview Button */}
                <Box
                    onClick={() => onDaySelect(null)}
                    component={motion.div} layout
                    sx={{
                        cursor: 'pointer',
                        minWidth: { xs: 50, md: 80 },
                        px: { xs: 0.5, md: 1.5 },
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 5,
                        bgcolor: isWeekOverviewSelected ? theme.sys.color.primary : 'transparent',
                        border: '2px solid transparent',
                        transition: 'background-color 0.2s ease, border-color 0.2s ease',
                        '&:hover': {
                            bgcolor: isWeekOverviewSelected ? theme.sys.color.primary : 'action.hover'
                        }
                    }}
                >
                    <Stack  spacing={0.3} alignItems="center">
                        <Typography
                            variant="caption"

                            sx={{
                                fontSize: { xs: '0.6rem', md: '0.7rem' },
                                fontWeight: 600,
                                color: isWeekOverviewSelected ? theme.sys.color.onPrimary : 'text.secondary',
                                textTransform: 'uppercase'
                            }}
                        >
                            Review
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 28, md: 32 },
                                height: { xs: 28, md: 32 },
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: isWeekOverviewSelected ? theme.sys.color.onPrimary : 'transparent'
                            }}
                        >
                            <CalendarViewWeek
                                sx={{
                                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                                    color: isWeekOverviewSelected ? theme.sys.color.primary : 'text.primary'
                                }}
                            />
                        </Box>
                        <Box sx={{ height: { xs: 12, md: 16 } }} />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
