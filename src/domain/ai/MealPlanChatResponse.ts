import SuggestedMeal from "./SuggestedMeal.ts";

export default interface MealPlanChatResponse {
    suggestions: SuggestedMeal[];
    reasoning: string;
    conversationComplete: boolean;
    updatedChatContext: Record<string, any>;
}
