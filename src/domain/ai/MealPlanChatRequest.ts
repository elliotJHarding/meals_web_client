import Plan from "../Plan.ts";
import Meal from "../Meal.ts";
import CalendarEvent from "../CalendarEvent.ts";
import ChatMessage from "./ChatMessage.ts";

export default interface MealPlanChatRequest {
    dayOfWeek: string; // ISO date string
    calendarEvents: CalendarEvent[];
    currentWeekPlan: Plan[];
    recentMealPlans: Plan[];
    availableMeals: Meal[];
    conversationHistory: ChatMessage[];
    chatContext: Record<string, any>;
}
