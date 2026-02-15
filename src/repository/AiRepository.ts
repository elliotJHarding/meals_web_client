import {MealPlanningApi, DayMealPlanChatRequest, DayMealPlanChatResponse, SuggestIngredientsRequest, SuggestIngredientsResponse, Configuration} from "@elliotJHarding/meals-api";
import axios from "axios";

export default class AiRepository {
    private api: MealPlanningApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new MealPlanningApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    chatMealPlanSuggestions(
        request: DayMealPlanChatRequest,
        onSuccess: (response: DayMealPlanChatResponse) => void,
        onFailure?: () => void
    ): void {
        console.info("Calling AI meal plan chat endpoint");
        console.info("Request:", request);

        this.api.chatMealPlanDay(request)
            .then(response => {
                const chatResponse: DayMealPlanChatResponse = response.data;
                console.info("AI chat response:", chatResponse);
                onSuccess(chatResponse);
            })
            .catch(error => {
                console.error(error);
                if (onFailure) {
                    onFailure();
                }
            });
    }

    suggestIngredients(
        request: SuggestIngredientsRequest,
        onSuccess: (response: SuggestIngredientsResponse) => void,
        onFailure?: () => void
    ): void {
        console.info("Calling AI suggest ingredients endpoint");

        this.api.suggestIngredientsProxy(request)
            .then(response => {
                const suggestResponse: SuggestIngredientsResponse = response.data;
                console.info("AI suggest ingredients response:", suggestResponse);
                onSuccess(suggestResponse);
            })
            .catch(error => {
                console.error(error);
                if (onFailure) {
                    onFailure();
                }
            });
    }
}
