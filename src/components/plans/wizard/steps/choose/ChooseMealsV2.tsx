import {Card} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {MealDto, PlanDto} from "@elliotJHarding/meals-api";
import {motion, AnimatePresence, PanInfo, useMotionValue, useSpring} from "framer-motion";
import {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import WeekProgressStrip from "./WeekProgressStrip.tsx";
import DayView from "./DayView.tsx";
import WeekOverview from "./WeekOverview.tsx";
import {useCalendarEvents} from "../../../../../hooks/calendar/useCalendarEvents.ts";
import AiChatSection from "./AiChatSection.tsx";
import {AiChatState, initialAiChatState, useAiMealChat} from "../../../../../hooks/ai/useAiMealChat.ts";
import PlanRepository from "../../../../../repository/PlanRepository.ts";

export default function ChooseMealsV2({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    meals: MealDto[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {
    const {calendarEvents, isAuthorized} = useCalendarEvents(from || '', to || '');
    const navigate = useNavigate();

    // Default to week overview (null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [swipeDirection, setSwipeDirection] = useState<number>(0);

    // AI Chat state - persists across day switches for continuous week planning conversation
    const [aiChatState, setAiChatState] = useState<AiChatState>(initialAiChatState);

    // Recent meal plans for AI to avoid repetition (previous 3 weeks)
    const [recentPlans, setRecentPlans] = useState<PlanDto[]>([]);
    const planRepository = useRef(new PlanRepository()).current;

    // Fetch recent plans on mount
    useEffect(() => {
        if (!from) return;

        const fromDate = new Date(from);
        const threeWeeksAgo = new Date(fromDate);
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
        const oneDayBefore = new Date(fromDate);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);

        planRepository.getPlans(
            threeWeeksAgo,
            oneDayBefore,
            (plans) => setRecentPlans(plans),
            () => console.error("Failed to fetch recent plans for AI")
        );
    }, [from, planRepository]);

    // Find the plan for the selected date (if one is selected)
    const selectedPlan = selectedDate ? mealPlan.plans.find(plan => {
        const planDate = new Date(plan.date);
        return planDate.getFullYear() === selectedDate.getFullYear() &&
            planDate.getMonth() === selectedDate.getMonth() &&
            planDate.getDate() === selectedDate.getDate();
    }) ?? null : null;

    // AI Chat hook - called at this level to share state between AiChatSection and DayView
    const aiChat = useAiMealChat(
        selectedPlan,
        mealPlan,
        meals,
        calendarEvents,
        recentPlans,
        aiChatState,
        setAiChatState
    );

    // Motion values for trackpad swiping
    const trackpadOffsetX = useMotionValue(0);
    const smoothOffsetX = useSpring(trackpadOffsetX, {
        stiffness: 300,
        damping: 30,
        mass: 0.5
    });

    // Refs for wheel event handling
    const dayViewRef = useRef<HTMLDivElement>(null);
    const scrollAccumulator = useRef(0);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Reset motion value when date changes
    useEffect(() => {
        trackpadOffsetX.set(0);
        scrollAccumulator.current = 0;
    }, [selectedDate, trackpadOffsetX]);

    const handlePlanUpdate = (updatedPlan: PlanDto) => {
        // Update the meal plan with the updated plan
        const updatedPlans = mealPlan.plans.map(p =>
            new Date(p.date).getTime() === new Date(updatedPlan.date).getTime() ? updatedPlan : p
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

    const handleSwipe = (info: PanInfo) => {
        if (!selectedDate) return;

        const swipeThreshold = 50;
        const velocityThreshold = 500;
        const { offset, velocity } = info;

        if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
            const adjacentDates = mealPlan.getAdjacentDates(selectedDate);

            if (offset.x > 0) {
                // Swiped right → previous day
                if (adjacentDates.prev) {
                    setSwipeDirection(1); // Exit right, enter from left
                    handleDaySelect(adjacentDates.prev);
                }
            } else {
                // Swiped left → next day
                if (adjacentDates.next) {
                    setSwipeDirection(-1); // Exit left, enter from right
                    handleDaySelect(adjacentDates.next);
                }
            }
        }
    };

    const handleScrollEnd = useCallback(() => {
        const currentOffset = scrollAccumulator.current;
        const threshold = 100; // pixels
        const adjacentDates = mealPlan.getAdjacentDates(selectedDate!);

        let shouldNavigate = false;
        let direction = 0;

        // Check if threshold exceeded
        if (currentOffset > threshold && adjacentDates.prev) {
            shouldNavigate = true;
            direction = 1; // Swiped right -> previous day
        } else if (currentOffset < -threshold && adjacentDates.next) {
            shouldNavigate = true;
            direction = -1; // Swiped left -> next day
        }

        if (shouldNavigate) {
            setSwipeDirection(direction);
            handleDaySelect(direction === 1 ? adjacentDates.prev! : adjacentDates.next!);
        } else {
            // If not navigating, smoothly snap back to center
            trackpadOffsetX.set(0);
        }

        // Reset accumulator
        scrollAccumulator.current = 0;
    }, [selectedDate, mealPlan, handleDaySelect, trackpadOffsetX]);

    const handleWheel = useCallback((event: WheelEvent) => {
        if (!selectedDate) return;

        // Only handle horizontal scroll
        if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;

        event.preventDefault();

        // Accumulate scroll (negative to match drag direction)
        scrollAccumulator.current -= event.deltaX;

        // Apply elastic resistance at boundaries
        const adjacentDates = mealPlan.getAdjacentDates(selectedDate);
        let offset = scrollAccumulator.current;

        // Add resistance if trying to scroll beyond available days
        if (offset > 0 && !adjacentDates.prev) {
            offset = Math.min(offset, 50) + (offset - 50) * 0.2; // Elastic resistance
        } else if (offset < 0 && !adjacentDates.next) {
            offset = Math.max(offset, -50) + (offset + 50) * 0.2;
        }

        // Scale down the movement for more subtle dragging (40% of actual movement)
        const scaledOffset = offset * 0.4;

        // Update motion value for real-time visual feedback
        trackpadOffsetX.set(scaledOffset);

        // Clear existing timeout
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        // Set timeout to detect end of scroll gesture
        scrollTimeout.current = setTimeout(() => {
            handleScrollEnd();
        }, 150);
    }, [selectedDate, mealPlan, handleScrollEnd, trackpadOffsetX]);

    // Attach wheel event listener for trackpad swipes
    useEffect(() => {
        const element = dayViewRef.current;
        if (!element || !selectedDate) return;

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [selectedDate, handleWheel]);

    return (
        <Card
            component={motion.div}
            variant={'outlined'}
            style={{borderRadius: 10, boxShadow: 'none', border: 'none', overflow: 'visible', backgroundColor: 'transparent'}}
            initial={{x: 100, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: 100, opacity: 0}}
        >
            {/* AI Chat Section - Above Week Strip */}
            <AiChatSection
                selectedDate={selectedDate}
                selectedPlan={selectedPlan}
                mealsLoading={mealsLoading}
                isAuthorized={isAuthorized}
                conversationHistory={aiChat.conversationHistory}
                inputMessage={aiChat.inputMessage}
                isLoading={aiChat.isLoading}
                error={aiChat.error}
                setInputMessage={aiChat.setInputMessage}
                sendMessage={aiChat.sendMessage}
            />

            {/* Week Progress Strip - Outside layout animation */}
            <WeekProgressStrip
                mealPlan={mealPlan}
                selectedDate={selectedDate}
                onDaySelect={handleDaySelect}
            />

            {/* Conditional Rendering: Week Overview or Day View - With scale/fade transition */}
            <AnimatePresence mode="wait">
                {selectedDate === null ? (
                    <motion.div
                        key="week-overview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                    >
                        <WeekOverview
                            mealPlan={mealPlan}
                            onDayClick={handleDaySelect}
                            calendarEvents={calendarEvents}
                            meals={meals}
                            mealsLoading={mealsLoading}
                            mealsFailed={mealsFailed}
                            setMealPlan={setMealPlan}
                        />
                    </motion.div>
                ) : selectedPlan && (
                    <motion.div
                        ref={dayViewRef}
                        key={new Date(selectedPlan.date).toISOString()}
                        style={{ x: smoothOffsetX }}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            x: swipeDirection === -1 ? 100 : swipeDirection === 1 ? -100 : 0
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            x: swipeDirection === -1 ? -100 : swipeDirection === 1 ? 100 : 0
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_event, info) => handleSwipe(info)}
                        whileDrag={{ cursor: "grabbing" }}
                        onAnimationComplete={() => {
                            setSwipeDirection(0);
                            trackpadOffsetX.set(0);
                        }}
                    >
                        <DayView
                            plan={selectedPlan}
                            mealPlan={mealPlan}
                            meals={meals}
                            mealsLoading={mealsLoading}
                            mealsFailed={mealsFailed}
                            onPlanUpdate={handlePlanUpdate}
                            calendarEvents={calendarEvents}
                            currentSuggestions={aiChat.currentSuggestions}
                            onRemoveSuggestion={aiChat.removeSuggestion}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
