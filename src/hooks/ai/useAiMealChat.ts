import { useRef, useEffect, useCallback } from "react";
import {PlanDto, MealDto, CalendarEventDto, ChatMessage, SuggestedMeal, DayMealPlanChatRequest} from "@elliotJHarding/meals-api";
import MealPlan from "../../domain/MealPlan.ts";
import AiRepository from "../../repository/AiRepository.ts";

export interface AiChatState {
    conversationHistory: ChatMessage[];
    chatContext: Record<string, any>;
    currentSuggestions: SuggestedMeal[];
    inputMessage: string;
    isLoading: boolean;
    error: string | null;
    lastInitializedDate: string | null; // Track which date we last auto-suggested for
}

export const initialAiChatState: AiChatState = {
    conversationHistory: [],
    chatContext: {},
    currentSuggestions: [],
    inputMessage: "",
    isLoading: false,
    error: null,
    lastInitializedDate: null,
};

export function useAiMealChat(
    plan: PlanDto | null,
    mealPlan: MealPlan,
    meals: MealDto[],
    calendarEvents: CalendarEventDto[],
    recentPlans: PlanDto[],
    // External state management for persistence across day switches
    chatState: AiChatState,
    setChatState: React.Dispatch<React.SetStateAction<AiChatState>>
) {
    const aiRepository = useRef(new AiRepository()).current;

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = plan ? calendarEvents.filter(event => {
        const eventDate = new Date(event.time!);
        const planDate = new Date(plan.date!);
        return eventDate.toDateString() === planDate.toDateString();
    }) : [];

    // Clean meals for API request (remove circular refs)
    const cleanMeals = useCallback(() => {
        return meals.map(meal => ({
            ...meal,
            ingredients: meal.ingredients?.map(ing => ({
                ...ing,
                // Remove circular meal reference and ensure unit is properly serialized
                meal: undefined,
                unit: ing.unit ? {
                    id: ing.unit.id,
                    code: ing.unit.code,
                    shortStem: ing.unit.shortStem,
                    shortSpace: ing.unit.shortSpace,
                    shortPluralise: ing.unit.shortPluralise,
                    longStem: ing.unit.longStem,
                    longSpace: ing.unit.longSpace,
                    longPluralise: ing.unit.longPluralise
                } : null
            })) || []
        }));
    }, [meals]);

    const sendMessage = useCallback((message: string, isSystemMessage: boolean = false) => {
        if (!plan) return;
        if (!message.trim() || chatState.isLoading) return;

        // Add user message to history
        const userMessage: ChatMessage = { role: 'user', content: message };
        const updatedHistory = [...chatState.conversationHistory, userMessage];

        setChatState(prev => ({
            ...prev,
            conversationHistory: updatedHistory,
            inputMessage: isSystemMessage ? prev.inputMessage : "",
            isLoading: true,
            error: null,
        }));

        const request: DayMealPlanChatRequest = {
            dayOfWeek: plan.date!,
            calendarEvents: filteredCalendarEvents,
            currentWeekPlan: mealPlan.plans,
            recentMealPlans: recentPlans,
            availableMeals: cleanMeals() as any,
            conversationHistory: updatedHistory,
            chatContext: chatState.chatContext
        };

        // Call AI API
        aiRepository.chatMealPlanSuggestions(
            request,
            (response) => {
                // Add assistant response to history
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: response.reasoning
                };

                setChatState(prev => ({
                    ...prev,
                    conversationHistory: [...updatedHistory, assistantMessage],
                    currentSuggestions: response.suggestions,
                    // FIX: Only update context if new context is provided, merge with existing
                    chatContext: response.updatedChatContext
                        ? { ...prev.chatContext, ...response.updatedChatContext }
                        : prev.chatContext,
                    isLoading: false,
                }));
            },
            () => {
                setChatState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to get AI meal suggestions. Please try again.',
                }));
            }
        );
    }, [plan, chatState.conversationHistory, chatState.chatContext, chatState.isLoading,
        filteredCalendarEvents, mealPlan.plans, recentPlans, cleanMeals, aiRepository, setChatState]);

    // Auto-suggest when a new day is selected
    const initializeChat = useCallback(() => {
        if (!plan) return;

        const planDateStr = new Date(plan.date!).toISOString().split('T')[0];

        // Don't re-initialize if we already did for this date
        if (chatState.lastInitializedDate === planDateStr) return;

        // Mark this date as initialized
        setChatState(prev => ({
            ...prev,
            lastInitializedDate: planDateStr,
        }));

        // Format the date nicely for the message
        const planDate = new Date(plan.date!);
        const dayName = planDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = planDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        // Send system message to get initial suggestions
        const initMessage = `I'm now planning meals for ${dayName}, ${dateStr}. Please suggest some meals for this day.`;
        sendMessage(initMessage, true);
    }, [plan, chatState.lastInitializedDate, sendMessage, setChatState]);

    // Auto-initialize when day changes (if authorized and meals are loaded)
    useEffect(() => {
        if (plan && meals.length > 0 && !chatState.isLoading) {
            const planDateStr = new Date(plan.date!).toISOString().split('T')[0];
            if (chatState.lastInitializedDate !== planDateStr) {
                initializeChat();
            }
        }
    }, [plan, meals.length, chatState.isLoading, chatState.lastInitializedDate, initializeChat]);

    const setInputMessage = useCallback((message: string) => {
        setChatState(prev => ({ ...prev, inputMessage: message }));
    }, [setChatState]);

    const clearSuggestions = useCallback(() => {
        setChatState(prev => ({ ...prev, currentSuggestions: [] }));
    }, [setChatState]);

    const removeSuggestion = useCallback((mealId: number | undefined) => {
        if (!mealId) return;
        setChatState(prev => ({
            ...prev,
            currentSuggestions: prev.currentSuggestions.filter(s => s.mealId !== mealId)
        }));
    }, [setChatState]);

    const clearError = useCallback(() => {
        setChatState(prev => ({ ...prev, error: null }));
    }, [setChatState]);

    return {
        conversationHistory: chatState.conversationHistory,
        currentSuggestions: chatState.currentSuggestions,
        inputMessage: chatState.inputMessage,
        isLoading: chatState.isLoading,
        error: chatState.error,
        setInputMessage,
        sendMessage: (msg: string) => sendMessage(msg, false),
        clearSuggestions,
        removeSuggestion,
        clearError,
        initializeChat,
    };
}
