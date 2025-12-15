import {Card} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Meal from "../../../../../domain/Meal.ts";
import {motion} from "framer-motion";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import WeekProgressStrip from "./WeekProgressStrip.tsx";
import DayView from "./DayView.tsx";
import WeekOverview from "./WeekOverview.tsx";
import Plan from "../../../../../domain/Plan.ts";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";

export default function ChooseMealsV2({
    mealPlan,
    from,
    to,
    selected,
    setMealPlan,
    meals,
    mealsLoading,
    mealsFailed
}: {
    mealPlan: MealPlan,
    setMealPlan: (MealPlan: MealPlan) => void,
    from: string | null,
    to: string | null,
    selected: string | null,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {
    const {calendarEvents} = useCalendarEvents(from || '', to || '');
    const navigate = useNavigate();

    // Default to week overview (null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Sync URL parameter with local state
    useEffect(() => {
        if (selected) {
            const date = new Date(selected);
            if (!isNaN(date.getTime())) {
                setSelectedDate(date);
            }
        } else {
            setSelectedDate(null);
        }
    }, [selected]);

    // Find the plan for the selected date (if one is selected)
    const selectedPlan = selectedDate ? mealPlan.plans.find(plan =>
        plan.date.getFullYear() === selectedDate.getFullYear() &&
        plan.date.getMonth() === selectedDate.getMonth() &&
        plan.date.getDate() === selectedDate.getDate()
    ) : null;

    const handlePlanUpdate = (updatedPlan: Plan) => {
        // Update the meal plan with the updated plan
        const updatedPlans = mealPlan.plans.map(p =>
            p.date.getTime() === updatedPlan.date.getTime() ? updatedPlan : p
        );
        setMealPlan(new MealPlan(updatedPlans));
    };

    const handleDaySelect = (date: Date | null) => {
        if (date) {
            navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}&selected=${MealPlan.formatDate(date)}`);
        } else {
            navigate(`?from=${mealPlan.from()}&to=${mealPlan.to()}`);
        }
    };

    return (
        <Card
            component={motion.div}
            variant={'outlined'}
            style={{borderRadius: 10, boxShadow: 'none', border: 'none', overflow: 'visible', backgroundColor: 'transparent'}}
            initial={{x: 100, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: 100, opacity: 0}}
        >
            {/* Week Progress Strip - Outside layout animation */}
            <WeekProgressStrip
                mealPlan={mealPlan}
                selectedDate={selectedDate}
                onDaySelect={handleDaySelect}
            />

            {/* Conditional Rendering: Week Overview or Day View - With layout animation */}
            <motion.div layout>
                {selectedDate === null ? (
                    <WeekOverview
                        mealPlan={mealPlan}
                        onDayClick={handleDaySelect}
                        calendarEvents={calendarEvents}
                        meals={meals}
                        mealsLoading={mealsLoading}
                        mealsFailed={mealsFailed}
                        setMealPlan={setMealPlan}
                    />
                ) : selectedPlan && (
                    <DayView
                        key={selectedPlan.date.toISOString()}
                        plan={selectedPlan}
                        mealPlan={mealPlan}
                        meals={meals}
                        mealsLoading={mealsLoading}
                        mealsFailed={mealsFailed}
                        onPlanUpdate={handlePlanUpdate}
                        calendarEvents={calendarEvents}
                    />
                )}
            </motion.div>
        </Card>
    );
}
