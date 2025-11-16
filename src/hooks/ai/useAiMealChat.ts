import { useState, useRef } from "react";
import Plan from "../../domain/Plan.ts";
import Meal from "../../domain/Meal.ts";
import CalendarEvent from "../../domain/CalendarEvent.ts";
import MealPlan from "../../domain/MealPlan.ts";
import ChatMessage from "../../domain/ai/ChatMessage.ts";
import SuggestedMeal from "../../domain/ai/SuggestedMeal.ts";
import MealPlanChatRequest from "../../domain/ai/MealPlanChatRequest.ts";
import AiRepository from "../../repository/AiRepository.ts";

export function useAiMealChat(
    plan: Plan,
    mealPlan: MealPlan,
    meals: Meal[],
    calendarEvents: CalendarEvent[]
) {
    const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
    const [chatContext, setChatContext] = useState<Record<string, any>>({});
    const [currentSuggestions, setCurrentSuggestions] = useState<SuggestedMeal[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const aiRepository = useRef(new AiRepository()).current;

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.time);
        const planDate = new Date(plan.date);
        return eventDate.toDateString() === planDate.toDateString();
    });

    const sendMessage = (message: string) => {
        if (!message.trim() || isLoading) return;

        // Add user message to history
        const userMessage: ChatMessage = { role: 'user', content: message };
        const updatedHistory = [...conversationHistory, userMessage];
        setConversationHistory(updatedHistory);
        setInputMessage("");
        setIsLoading(true);

        // Prepare request - serialize dates and clean up nested objects to avoid backend parsing issues
        const cleanedMeals = meals.map(meal => ({
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

        const request: MealPlanChatRequest = {
            dayOfWeek: plan.date.toISOString().split('T')[0],
            calendarEvents: filteredCalendarEvents.map(event => ({
                ...event,
                time: event.time.toISOString()
            })) as any,
            currentWeekPlan: mealPlan.plans.map(p => ({
                ...p,
                date: p.date.toISOString()
            })) as any,
            recentMealPlans: [], // Could be enhanced to fetch recent plans
            availableMeals: cleanedMeals as any,
            conversationHistory: updatedHistory,
            chatContext: chatContext
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
                setConversationHistory([...updatedHistory, assistantMessage]);

                // Update suggestions and context
                setCurrentSuggestions(response.suggestions);
                setChatContext(response.updatedChatContext);
                setIsLoading(false);
            },
            () => {
                setIsLoading(false);
                // Error is handled by repository toast
            }
        );
    };

    const clearSuggestions = () => {
        setCurrentSuggestions([]);
    };

    const removeSuggestion = (mealId: bigint | undefined) => {
        if (!mealId) return;
        setCurrentSuggestions(prev =>
            prev.filter(suggestion => suggestion.meal.id !== mealId)
        );
    };

    return {
        conversationHistory,
        currentSuggestions,
        inputMessage,
        isLoading,
        setInputMessage,
        sendMessage,
        clearSuggestions,
        removeSuggestion
    };
}
