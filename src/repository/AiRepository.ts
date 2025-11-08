import {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";
import MealPlanChatRequest from "../domain/ai/MealPlanChatRequest.ts";
import MealPlanChatResponse from "../domain/ai/MealPlanChatResponse.ts";

export default class AiRepository extends ResourceRepository {

    chatMealPlanSuggestions(
        request: MealPlanChatRequest,
        onSuccess: (response: MealPlanChatResponse) => void,
        onFailure?: () => void
    ): void {
        console.info("Calling AI meal plan chat endpoint");
        console.info("Request:", request);

        this.post(
            "ai/meal-plan-chat",
            request,
            (response: AxiosResponse) => {
                const chatResponse: MealPlanChatResponse = response.data;
                console.info("AI chat response:", chatResponse);
                onSuccess(chatResponse);
            },
            false // Don't suppress toast on error
        );
    }
}
